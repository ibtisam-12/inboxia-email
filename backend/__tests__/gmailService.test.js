import { applyFilters } from '../services/gmailService.js';

describe('applyFilters', () => {
  const mockEmails = [
    {
      emailId: '1',
      body: 'We are hiring software engineers. Apply now!',
      headers: { Subject: 'Job Opportunity' }
    },
    {
      emailId: '2',
      body: 'Your order has been shipped.',
      headers: { Subject: 'Order Update' }
    },
    {
      emailId: '3',
      body: 'Internship program for 2025',
      headers: { Subject: 'Internship' }
    }
  ];

  test('returns empty array for null/empty emails', () => {
    expect(applyFilters(null, { keywords: 'test' })).toEqual([]);
    expect(applyFilters([], { keywords: 'test' })).toEqual([]);
  });

  test('returns empty array for no keywords', () => {
    expect(applyFilters(mockEmails, {})).toEqual([]);
    expect(applyFilters(mockEmails, { keywords: '' })).toEqual([]);
  });

  test('filters emails by keyword', () => {
    const result = applyFilters(mockEmails, { keywords: 'hiring' });
    expect(result).toHaveLength(1);
    expect(result[0].emailId).toBe('1');
  });

  test('filters by multiple keywords (OR logic)', () => {
    const result = applyFilters(mockEmails, { keywords: 'internship,hiring' });
    expect(result).toHaveLength(2);
    expect(result.map(e => e.emailId)).toEqual(expect.arrayContaining(['1', '3']));
  });

  test('filters are case-insensitive', () => {
    const result = applyFilters(mockEmails, { keywords: 'HIRING' });
    expect(result).toHaveLength(1);
    expect(result[0].emailId).toBe('1');
  });

  test('matches in headers', () => {
    const result = applyFilters(mockEmails, { keywords: 'opportunity' });
    expect(result).toHaveLength(1);
    expect(result[0].emailId).toBe('1');
  });

  test('removes punctuation before matching', () => {
    const emails = [{
      emailId: '4',
      body: 'Urgent: hiring!!!',
      headers: {}
    }];
    const result = applyFilters(emails, { keywords: 'hiring' });
    expect(result).toHaveLength(1);
  });
});
