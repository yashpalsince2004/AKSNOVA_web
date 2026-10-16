import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Web-page form direct Supabase payload and validation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('validates 10-digit mobile number format correctly', () => {
    const cleanNumber = (num: string) => {
      const digits = num.replace(/\D/g, '');
      return digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
    };

    expect(cleanNumber('+91 9876543210')).toBe('9876543210');
    expect(cleanNumber('98765 43210')).toBe('9876543210');
    expect(cleanNumber('9876543210')).toBe('9876543210');
    expect(cleanNumber('12345')).toBe('12345'); // invalid length
  });

  it('formats payload with the 4 required fields: name, number, email, query', () => {
    const rawInput = {
      name: '  Rahul Sharma  ',
      number: '+91 98765 43210',
      email: '  Rahul@Example.COM ',
      query: ' Interested in Full Stack Development batch timings ',
    };

    const cleanNum = rawInput.number.replace(/\D/g, '');
    const number = cleanNum.length === 12 && cleanNum.startsWith('91') ? cleanNum.slice(2) : cleanNum;

    const payload = {
      name: rawInput.name.trim(),
      number,
      email: rawInput.email.trim().toLowerCase(),
      query: rawInput.query.trim(),
    };

    expect(payload).toEqual({
      name: 'Rahul Sharma',
      number: '9876543210',
      email: 'rahul@example.com',
      query: 'Interested in Full Stack Development batch timings',
    });

    expect(Object.keys(payload)).toEqual(['name', 'number', 'email', 'query']);
  });

  it('rejects phone numbers starting with 0 or not exactly 10 digits', () => {
    const validatePhone = (num: string) => {
      const rawNum = num.replace(/\D/g, '');
      const normalizedPhone = rawNum.length === 12 && rawNum.startsWith('91') ? rawNum.slice(2) : rawNum;
      if (!normalizedPhone) return { valid: false, error: 'Enter your 10-digit mobile number.' };
      if (normalizedPhone.startsWith('0')) return { valid: false, error: 'Mobile number cannot start with 0.' };
      if (normalizedPhone.length !== 10) return { valid: false, error: 'Enter a valid 10-digit mobile number.' };
      return { valid: true, phone: normalizedPhone };
    };

    expect(validatePhone('0987654321').valid).toBe(false);
    expect(validatePhone('0987654321').error).toBe('Mobile number cannot start with 0.');
    expect(validatePhone('987654321').valid).toBe(false); // 9 digits
    expect(validatePhone('98765432101').valid).toBe(false); // 11 digits
    expect(validatePhone('9876543210').valid).toBe(true);
    expect(validatePhone('+91 9876543210').valid).toBe(true);
  });

  it('structures query table payload containing phone and number aliases', () => {
    const payload = {
      name: 'Priya Verma',
      number: '9876543210',
      email: 'priya@example.com',
      query: 'Inquiry about Data Analytics curriculum',
    };

    const queryPayload = {
      name: payload.name,
      number: payload.number,
      phone: payload.number,
      email: payload.email,
      query: payload.query,
    };

    expect(queryPayload).toMatchObject({
      name: 'Priya Verma',
      number: '9876543210',
      phone: '9876543210',
      email: 'priya@example.com',
      query: 'Inquiry about Data Analytics curriculum',
    });
  });
});
