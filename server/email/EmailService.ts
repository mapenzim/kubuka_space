export interface SupportEmail {
  threadId: string;

  messageId: string;

  content: string;

  timestamp: Date;
}

export interface CustomerEmail {
  threadId: string;

  messageId: string;

  content: string;

  timestamp: Date;
}

export class EmailService {
  // =====================================================
  // SUPPORT
  // =====================================================

  async notifySupport(
    email: SupportEmail
  ) {
    // TODO:
    // Integrate Resend, Nodemailer, SendGrid, etc.

    return {
      success: true,
    };
  }

  // =====================================================
  // CUSTOMER
  // =====================================================

  async notifyCustomer(
    email: CustomerEmail
  ) {
    // TODO:
    // Integrate Resend, Nodemailer, SendGrid, etc.

    return {
      success: true,
    };
  }
}

export const emailService =
  new EmailService();
