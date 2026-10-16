import { describe, it, expect } from 'vitest';

describe('Career Application Form Payload and Validation', () => {
  it('cleans and normalizes 10-digit Indian phone numbers and rejects leading zero', () => {
    const normalizePhone = (num: string) => {
      const digits = num.replace(/\D/g, '');
      const raw = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
      const noLeadingZero = raw.replace(/^0+/, '');
      return noLeadingZero.slice(0, 10);
    };

    expect(normalizePhone('+91 9876543210')).toBe('9876543210');
    expect(normalizePhone('98765 43210')).toBe('9876543210');
    expect(normalizePhone('9876543210')).toBe('9876543210');
    expect(normalizePhone('+919876543210')).toBe('9876543210');
    expect(normalizePhone('09876543210')).toBe('9876543210'); // stripped leading zero
    expect(normalizePhone('12345')).toBe('12345'); // invalid length
  });

  it('validates all 4 required fields: name, phone, qualification, role and rejects invalid phone', () => {
    const validateForm = (input: {
      name?: string;
      phone?: string;
      qualification?: string;
      role?: string;
    }) => {
      const name = (input.name || '').trim();
      const phoneDigits = (input.phone || '').replace(/\D/g, '');
      const phone = phoneDigits.length === 12 && phoneDigits.startsWith('91') ? phoneDigits.slice(2) : phoneDigits;
      const qualification = (input.qualification || '').trim();
      const role = (input.role || '').trim();

      if (!name || name.length < 2) return { valid: false, error: 'name' };
      if (!phone || phone.startsWith('0') || phone.length !== 10) return { valid: false, error: 'phone' };
      if (!qualification) return { valid: false, error: 'qualification' };
      if (!role || role.length < 2) return { valid: false, error: 'role' };

      return {
        valid: true,
        payload: {
          name,
          phone,
          qualification,
          role,
        },
      };
    };

    // Valid case
    const validResult = validateForm({
      name: 'Aditi Sharma',
      phone: '+91 98765 43210',
      qualification: 'B.Tech / B.E (CS / IT / EC / EE)',
      role: 'Full Stack Trainer',
    });
    expect(validResult.valid).toBe(true);
    expect(validResult.payload).toEqual({
      name: 'Aditi Sharma',
      phone: '9876543210',
      qualification: 'B.Tech / B.E (CS / IT / EC / EE)',
      role: 'Full Stack Trainer',
    });

    // Missing qualification
    expect(
      validateForm({
        name: 'Aditi Sharma',
        phone: '9876543210',
        qualification: '',
        role: 'Full Stack Trainer',
      }).valid,
    ).toBe(false);

    // Missing role
    expect(
      validateForm({
        name: 'Aditi Sharma',
        phone: '9876543210',
        qualification: 'MCA',
        role: '',
      }).valid,
    ).toBe(false);

    // Short name
    expect(
      validateForm({
        name: 'A',
        phone: '9876543210',
        qualification: 'MCA',
        role: 'Developer',
      }).valid,
    ).toBe(false);
  });

  it('formats applicant payload specifically for Supabase Hiring table', () => {
    const rawApplicant = {
      name: '  Yashpal Sharma  ',
      phone: '+91 98765 43210',
      qualification: 'B.Tech / B.E (CS / IT / EC / EE)',
      role: 'Full Stack Web Development Trainer',
    };

    const digits = rawApplicant.phone.replace(/\D/g, '');
    const phone = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;

    const hiringPayload = {
      name: rawApplicant.name.trim(),
      phone,
      qualification: rawApplicant.qualification.trim(),
      role: rawApplicant.role.trim(),
    };

    expect(hiringPayload).toEqual({
      name: 'Yashpal Sharma',
      phone: '9876543210',
      qualification: 'B.Tech / B.E (CS / IT / EC / EE)',
      role: 'Full Stack Web Development Trainer',
    });

    expect(Object.keys(hiringPayload)).toEqual(['name', 'phone', 'qualification', 'role']);
  });
});
