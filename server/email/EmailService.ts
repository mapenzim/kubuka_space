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

    console.log(
      "[EMAIL] Support Notification",
      email
    );

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

    console.log(
      "[EMAIL] Customer Notification",
      email
    );

    return {
      success: true,
    };
  }
}

export const emailService =
  new EmailService();