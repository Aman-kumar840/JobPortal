INSERT INTO urls (long_url)
SELECT 'https://example.com/' || generate_series(1,50000);

SELECT COUNT(*) FROM urls;
DROP INDEX IF EXISTS idx_short_code;

CREATE INDEX idx_short_code ON urls(short_code);

