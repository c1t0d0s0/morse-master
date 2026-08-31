import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { extractGtmId, googleAnalyticsPlugin } from '../vite.config';

describe('Google Analytics Config Tests', () => {
  const tempConfigDir = path.resolve(__dirname, '../temp_test');
  const tempConfigFile = path.join(tempConfigDir, 'config.js');

  beforeEach(() => {
    if (!fs.existsSync(tempConfigDir)) {
      fs.mkdirSync(tempConfigDir, { recursive: true });
    }
  });

  afterEach(() => {
    if (fs.existsSync(tempConfigDir)) {
      fs.rmSync(tempConfigDir, { recursive: true, force: true });
    }
  });

  it('should extract GTM_ID with const declaration and single quotes', () => {
    const code = "const GTM_ID = 'G-S6QX2XHT2D';";
    expect(extractGtmId(code)).toBe('G-S6QX2XHT2D');
  });

  it('should extract GTM_ID with let / var / window / double quotes / backticks', () => {
    expect(extractGtmId('let GTM_ID = "G-1234567890";')).toBe('G-1234567890');
    expect(extractGtmId("var GTM_ID = 'GTM-ABCDEF';")).toBe('GTM-ABCDEF');
    expect(extractGtmId('window.GTM_ID = `G-TEST1234`;')).toBe('G-TEST1234');
    expect(extractGtmId('GTM_ID: "G-OBJECTVAL"')).toBe('G-OBJECTVAL');
    expect(extractGtmId("export const GTM_ID = 'G-EXPORTED';")).toBe('G-EXPORTED');
  });

  it('should return null when GTM_ID is not present or invalid', () => {
    expect(extractGtmId('')).toBeNull();
    expect(extractGtmId('const OTHER_VAR = "something";')).toBeNull();
  });

  it('should inject Google Analytics tag when config.js exists', () => {
    fs.writeFileSync(tempConfigFile, "const GTM_ID = 'G-S6QX2XHT2D';", 'utf-8');
    const plugin = googleAnalyticsPlugin(tempConfigFile);
    const transform = plugin.transformIndexHtml as any;
    const result = transform('<html><head></head><body></body></html>');

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
    expect(result[0].attrs.src).toBe('https://www.googletagmanager.com/gtag/js?id=G-S6QX2XHT2D');
    expect(result[1].children).toContain("gtag('config', 'G-S6QX2XHT2D')");
  });

  it('should not inject tags when config.js does not exist', () => {
    const nonExistentPath = path.join(tempConfigDir, 'non_existent_config.js');
    const plugin = googleAnalyticsPlugin(nonExistentPath);
    const transform = plugin.transformIndexHtml as any;
    const html = '<html><head></head><body></body></html>';
    const result = transform(html);

    expect(result).toBe(html);
  });

  it('should not inject tags when config.js exists but has no GTM_ID', () => {
    fs.writeFileSync(tempConfigFile, 'const OTHER = "123";', 'utf-8');
    const plugin = googleAnalyticsPlugin(tempConfigFile);
    const transform = plugin.transformIndexHtml as any;
    const html = '<html><head></head><body></body></html>';
    const result = transform(html);

    expect(result).toBe(html);
  });
});
