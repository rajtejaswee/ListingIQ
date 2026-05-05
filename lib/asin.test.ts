import { describe, it, expect } from 'vitest';

// Minimal mock or just test the logic if I export the regex, 
// but it's internal to scrapeReviews.
// I'll test the behavior of a hypothetical asin extractor if I refactor it, 
// or I'll just test the function with mocked fetch.

const extractAsin = (url: string) => {
  const asinMatch = url.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
  return asinMatch ? asinMatch[1] : null;
};

describe('ASIN extraction', () => {
  it('extracts ASIN from standard /dp/ URL', () => {
    const url = 'https://www.amazon.com/Vital-Proteins-Collagen-Peptides-Pasture-Raised/dp/B00K6JUG4K';
    expect(extractAsin(url)).toBe('B00K6JUG4K');
  });

  it('extracts ASIN from /gp/product/ URL', () => {
    const url = 'https://www.amazon.com/gp/product/B00K6JUG4K';
    expect(extractAsin(url)).toBe('B00K6JUG4K');
  });

  it('extracts ASIN from URL with query parameters', () => {
    const url = 'https://www.amazon.com/dp/B00K6JUG4K?ref=some_ref';
    expect(extractAsin(url)).toBe('B00K6JUG4K');
  });

  it('returns null for non-Amazon URLs', () => {
    const url = 'https://example.com/product/123';
    expect(extractAsin(url)).toBeNull();
  });
});
