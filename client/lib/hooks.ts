import { EmailService } from '@/app/actions/others/utils';
import { useState } from 'react';

export interface EmailData {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export interface SendEmailResult {
  success: boolean;
  message: string;
}

const useSendEmail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendEmail = async (emailData: EmailData): Promise<SendEmailResult> => {
    setLoading(true);
    setError(null);

    try {
      const response = await EmailService(emailData);

      if (!response) {
        throw new Error('Failed to send email');
      }

      setLoading(false);
      return { success: true, message: "Email sent succesfully !" };
    } catch (err:any) {
      setLoading(false);
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  return { sendEmail, loading, error };
};

export default useSendEmail;