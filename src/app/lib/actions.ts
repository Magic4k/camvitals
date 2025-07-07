'use server';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    // Validate the credentials
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
      return 'Please provide both email and password.';
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      return 'Invalid form data.';
    }

    // TODO: Implement actual authentication logic here
    // For now, we'll simulate a failed login
    return 'Invalid credentials. Please try again.';

  } catch (error) {
    return 'An unexpected error occurred. Please try again.';
  }
} 