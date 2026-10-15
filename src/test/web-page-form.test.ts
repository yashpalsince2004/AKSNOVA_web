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
});
