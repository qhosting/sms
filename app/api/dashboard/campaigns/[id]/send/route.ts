

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// POST - Send campaign immediately
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { company: true }
    });

    if (!user || !user.companyId || !user.company) {
      return NextResponse.json(
        { error: 'Usuario no tiene empresa asociada' },
        { status: 403 }
      );
    }

    const campaign = await prisma.campaign.findFirst({
      where: {
        id: params.id,
        companyId: user.companyId,
      },
      include: {
        contactList: {
          include: {
            contacts: {
              where: { isValid: true }
            }
          }
        }
      }
    });

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaña no encontrada' },
        { status: 404 }
      );
    }

    // Can only send draft or scheduled campaigns
    if (!['DRAFT', 'SCHEDULED'].includes(campaign.status)) {
      return NextResponse.json(
        { error: 'Solo se pueden enviar campañas en borrador o programadas' },
        { status: 400 }
      );
    }

    // Check if company has enough credits
    if (user.company.credits < campaign.estimatedCost) {
      return NextResponse.json(
        { error: 'Créditos insuficientes para enviar esta campaña' },
        { status: 400 }
      );
    }

    // Get target contacts
    let contacts: any[] = [];
    
    if (campaign.targetType === 'LIST' && campaign.contactList) {
      contacts = campaign.contactList.contacts;
    } else if (campaign.targetType === 'ALL_CONTACTS') {
      // Get all contacts from all lists of the company
      const allContactLists = await prisma.contactList.findMany({
        where: { companyId: user.companyId },
        include: {
          contacts: {
            where: { isValid: true }
          }
        }
      });
      
      // Flatten and deduplicate by phone number
      const phoneSet = new Set();
      contacts = allContactLists
        .flatMap(list => list.contacts)
        .filter(contact => {
          if (phoneSet.has(contact.phone)) {
            return false;
          }
          phoneSet.add(contact.phone);
          return true;
        });
    }

    if (contacts.length === 0) {
      return NextResponse.json(
        { error: 'No hay contactos válidos para enviar' },
        { status: 400 }
      );
    }

    // Start transaction to update campaign and create messages
    await prisma.$transaction(async (tx) => {
      // Update campaign status
      await tx.campaign.update({
        where: { id: params.id },
        data: {
          status: 'SENDING',
          startedAt: new Date(),
          totalRecipients: contacts.length,
        }
      });

      // Create message records for each contact
      const messageData = contacts.map(contact => {
        // Replace variables in message
        let personalizedMessage = campaign.message;
        if (contact.firstName) {
          personalizedMessage = personalizedMessage.replace(/\{firstName\}/g, contact.firstName);
        }
        if (contact.lastName) {
          personalizedMessage = personalizedMessage.replace(/\{lastName\}/g, contact.lastName);
        }
        if (contact.company) {
          personalizedMessage = personalizedMessage.replace(/\{company\}/g, contact.company);
        }
        
        return {
          phone: contact.phone,
          message: personalizedMessage,
          campaignId: params.id,
          contactId: contact.id,
          status: 'PENDING' as const,
          creditsUsed: 1,
        };
      });

      // Create messages in batches to avoid memory issues
      const batchSize = 100;
      for (let i = 0; i < messageData.length; i += batchSize) {
        const batch = messageData.slice(i, i + batchSize);
        await tx.message.createMany({
          data: batch,
        });
      }

      // Deduct credits from company
      await tx.company.update({
        where: { id: user.companyId! },
        data: {
          credits: {
            decrement: contacts.length
          }
        }
      });

      // Create credit transaction
      await tx.creditTransaction.create({
        data: {
          type: 'USAGE',
          amount: -contacts.length,
          balance: user.company!.credits - contacts.length,
          description: `Envío de campaña: ${campaign.name}`,
          reference: params.id,
          companyId: user.companyId!,
        }
      });
    });

    // In a real implementation, you would queue the messages for actual SMS sending
    // For now, we'll simulate immediate processing by updating messages to SENT
    setTimeout(async () => {
      try {
        await simulateMessageSending(params.id);
      } catch (error) {
        console.error('Error simulating message sending:', error);
      }
    }, 1000);

    return NextResponse.json({
      success: true,
      message: 'Campaña enviada exitosamente',
      totalMessages: contacts.length
    });
  } catch (error) {
    console.error('Error sending campaign:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Simulate SMS sending (in real implementation, this would be done by SMS provider)
async function simulateMessageSending(campaignId: string) {
  const messages = await prisma.message.findMany({
    where: {
      campaignId: campaignId,
      status: 'PENDING'
    }
  });

  for (const message of messages) {
    // Simulate random success/failure (90% success rate)
    const isSuccess = Math.random() > 0.1;
    
    await prisma.message.update({
      where: { id: message.id },
      data: {
        status: isSuccess ? 'SENT' : 'FAILED',
        sentAt: isSuccess ? new Date() : null,
        deliveredAt: isSuccess ? new Date() : null,
        failReason: isSuccess ? null : 'Número no válido',
      }
    });

    // Small delay to simulate processing time
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  // Update campaign statistics
  const campaignStats = await prisma.message.groupBy({
    by: ['status'],
    where: { campaignId: campaignId },
    _count: { status: true }
  });

  const sentCount = campaignStats.find(s => s.status === 'SENT')?._count.status || 0;
  const deliveredCount = campaignStats.find(s => s.status === 'SENT')?._count.status || 0;
  const failedCount = campaignStats.find(s => s.status === 'FAILED')?._count.status || 0;

  // Update campaign with final statistics
  await prisma.campaign.update({
    where: { id: campaignId },
    data: {
      status: 'COMPLETED',
      completedAt: new Date(),
      sentCount,
      deliveredCount,
      failedCount,
      creditsUsed: sentCount + failedCount,
      actualCost: sentCount + failedCount,
    }
  });
}
