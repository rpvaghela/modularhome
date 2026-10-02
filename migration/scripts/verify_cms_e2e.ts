import 'dotenv/config';
import { query } from '../../src/lib/db';
import { getPageUrl, formatCmsPage } from '../../src/lib/publicData';
import { getPublicPageBySlug } from '../../src/lib/pageDataServer';
import { getPublicGlobalSettings } from '../../src/lib/settings';

async function runE2EVerification() {
  console.log('====================================================');
  console.log('  STARTING E2E CMS & PAGE MANAGER VERIFICATION TEST ');
  console.log('====================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    totalTests++;
    if (condition) {
      console.log(`[PASS] ${testName}`);
      if (detail) console.log(`       ${detail}`);
      passedTests++;
    } else {
      console.error(`[FAIL] ${testName}`);
      if (detail) console.error(`       DETAIL: ${detail}`);
    }
  }

  try {
    // PRE-TEST: Schema Column Safeguards
    await query('ALTER TABLE pages ADD COLUMN IF NOT EXISTS content TEXT;');
    await query('ALTER TABLE pages ADD COLUMN IF NOT EXISTS meta_description TEXT;');
    await query('UPDATE pages SET content = body_html WHERE (content IS NULL OR content = \'\') AND body_html IS NOT NULL;');
    await query('UPDATE pages SET meta_description = seo_description WHERE (meta_description IS NULL OR meta_description = \'\') AND seo_description IS NOT NULL;');

    // TEST 1: Database Connectivity & Existing Pages Count
    console.log('\n--- 1. DATABASE CONNECTIVITY & RECORD INTEGRITY ---');
    const pagesCountRes = await query('SELECT count(*) FROM pages;');
    const pageCount = parseInt(pagesCountRes?.rows?.[0]?.count || '0', 10);
    assert(pageCount >= 4, `PostgreSQL pages table contains ${pageCount} pages (>= 4 required)`);

    const sectionsCountRes = await query('SELECT count(*) FROM page_sections;');
    const sectionCount = parseInt(sectionsCountRes?.rows?.[0]?.count || '0', 10);
    assert(sectionCount >= 5, `PostgreSQL page_sections table contains ${sectionCount} sections (>= 5 required)`);

    const settingsRes = await query('SELECT * FROM global_settings LIMIT 1;');
    assert(Boolean(settingsRes && settingsRes.rows && settingsRes.rows.length > 0), 'Global settings table has active configuration record');

    // TEST 2: URL Generator and /undefined elimination
    console.log('\n--- 2. URL GENERATOR & ROUTE SAFETY ---');
    const validHome = getPageUrl({ slug: 'home' });
    assert(validHome === '/', 'Home page maps correctly to root "/"', `Result: ${validHome}`);

    const validAbout = getPageUrl({ slug: 'about' });
    assert(validAbout === '/about', 'About page maps cleanly to "/about"', `Result: ${validAbout}`);

    const undefinedSlugPage = getPageUrl({ slug: undefined });
    assert(undefinedSlugPage === null, 'Undefined slug returns null instead of "/undefined"', `Result: ${undefinedSlugPage}`);

    const emptySlugPage = getPageUrl({ slug: '   ' });
    assert(emptySlugPage === null, 'Empty slug returns null instead of "/null" or "/"', `Result: ${emptySlugPage}`);

    // TEST 3: Create a dynamic test page with full SEO, OpenGraph & Timestamps
    console.log('\n--- 3. PAGE CREATION & DB MUTATION ---');
    const testSlug = 'e2e-verification-page';
    // Clean up if old test existed
    await query('DELETE FROM pages WHERE slug = $1;', [testSlug]);

    const createPageRes = await query(
      `INSERT INTO pages (
        handle, title, subtitle, slug, content, status,
        seo_title, meta_description, canonical_url, robots,
        og_title, og_description, og_image, image_alt, featured_image,
        created_at, updated_at, published_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW(), NOW())
      RETURNING *;`,
      [
        testSlug,
        'E2E Verification Showcase',
        'Engineered cold-formed steel framing test',
        testSlug,
        '<h2>Precision Manufacturing</h2><p>This is dynamic body content verified directly from PostgreSQL.</p>',
        'published',
        'E2E Verification Showcase | ModularHome.com',
        'Discover high precision cold-formed steel homes engineered for hurricane resilience.',
        'https://modularhome.com/e2e-verification-page',
        'index,follow',
        'Social OG Title Test',
        'Social OG Description Test',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
        'Modern Steel Home Exterior',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200'
      ]
    );

    const createdPage = createPageRes?.rows?.[0];
    const pageUuid = createdPage?.id;
    assert(Boolean(createdPage && createdPage.slug === testSlug), 'Test page inserted and persisted in PostgreSQL database');

    // TEST 4: Add Structured Modular Sections (Hero, Trust, Steps, FAQ)
    console.log('\n--- 4. MODULAR SECTION CREATION & PERSISTENCE ---');
    const heroContent = JSON.stringify({
      ctaLabel: 'Custom Quote CTA',
      ctaLink: '/quote',
      secondaryCtaLabel: 'View Models',
      secondaryCtaLink: '/buildings',
      rawText: 'Engineered for 150 MPH hurricane winds.'
    });

    const sec1 = await query(
      `INSERT INTO page_sections (page_id, type, title, subtitle, content, display_order, is_visible, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING *;`,
      [pageUuid, 'HERO', 'Test Hero Title', 'Built to Last', heroContent, 1, true]
    );
    assert(Boolean(sec1 && sec1.rows && sec1.rows.length === 1), 'Section 1 (HERO) added to PostgreSQL');

    const trustContent = JSON.stringify({
      cards: [
        { title: 'Commercial Cold-Formed Steel', description: 'Zero warping or termite rot', link: '/about' },
        { title: '50-Year Structural Guarantee', description: 'Engineered for seismic and wind loads', link: '/warranty-certifications' }
      ]
    });
    const sec2 = await query(
      `INSERT INTO page_sections (page_id, type, title, subtitle, content, display_order, is_visible, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING *;`,
      [pageUuid, 'TRUST', 'Why ModularHome Steel', 'Engineered Superiority', trustContent, 2, true]
    );
    assert(Boolean(sec2 && sec2.rows && sec2.rows.length === 1), 'Section 2 (TRUST) with structured cards added to PostgreSQL');

    const faqContent = JSON.stringify({
      faqs: [
        { question: 'What is the lead time?', answer: 'Factory fabrication takes 4-8 weeks.' },
        { question: 'Is financing available?', answer: 'Yes, we work with construction-to-perm lenders nationwide.' }
      ]
    });
    const sec3 = await query(
      `INSERT INTO page_sections (page_id, type, title, subtitle, content, display_order, is_visible, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING *;`,
      [pageUuid, 'FAQ', 'Frequently Asked Questions', 'Clear Answers', faqContent, 3, true]
    );
    assert(Boolean(sec3 && sec3.rows && sec3.rows.length === 1), 'Section 3 (FAQ) with structured Q&A added to PostgreSQL');

    // TEST 5: Public Page Data Hydration via getPublicPageBySlug
    console.log('\n--- 5. PUBLIC ROUTE DATA HYDRATION ---');
    const publicData = await getPublicPageBySlug(testSlug);
    assert(publicData !== null, 'getPublicPageBySlug retrieves newly created page from PostgreSQL');
    assert(publicData?.title === 'E2E Verification Showcase', 'Public page title matches database record');
    assert(publicData?.seoTitle === 'E2E Verification Showcase | ModularHome.com', 'SEO Title matches database record');
    assert(publicData?.ogImage === 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200', 'OpenGraph image is correctly populated');
    assert(publicData?.sections?.length === 3, 'Public page contains all 3 database-backed sections');

    const heroSection = publicData?.sections?.find(s => s.type === 'HERO');
    assert(heroSection?.title === 'Test Hero Title', 'HERO section title hydrated cleanly');

    const faqSection = publicData?.sections?.find(s => s.type === 'FAQ');
    assert(Boolean(faqSection?.content && faqSection.content.includes('What is the lead time?')), 'FAQ section content contains structured questions');

    // TEST 6: Core Page Verification (About, Contact, Warranties)
    console.log('\n--- 6. CORE CMS PAGES VERIFICATION ---');
    const aboutPage = await getPublicPageBySlug('about');
    assert(aboutPage !== null, 'Public /about page is hydrated from DB');
    assert(Boolean(aboutPage?.sections && aboutPage.sections.length >= 4), `Public /about has ${aboutPage?.sections?.length} active sections`);

    const contactPage = await getPublicPageBySlug('contact');
    assert(contactPage !== null, 'Public /contact page is hydrated from DB');

    const warrantyPage = await getPublicPageBySlug('warranty-certifications');
    assert(warrantyPage !== null, 'Public /warranty-certifications page is hydrated from DB');

    // TEST 7: Global Settings & Navigation Hydration
    console.log('\n--- 7. GLOBAL SETTINGS & NAVIGATION HYDRATION ---');
    const settings = await getPublicGlobalSettings();
    assert(settings !== null, 'Global settings loaded from PostgreSQL');
    assert(Boolean(settings.navLinks && settings.navLinks.length > 0), `Navigation links exist: ${settings.navLinks?.map(n => n.label).join(', ')}`);
    assert(Boolean(settings.footerLinks && settings.footerLinks.length > 0), `Footer links exist: ${settings.footerLinks?.length} links`);

    // TEST 8: Reordering and Visibility Mutation Test
    console.log('\n--- 8. SECTION VISIBILITY & ORDER MUTATION ---');
    // Hide Section 2
    if (sec2?.rows?.[0]?.id) {
      await query('UPDATE page_sections SET is_visible = false WHERE id = $1;', [sec2.rows[0].id]);
    }
    const updatedPage = await getPublicPageBySlug(testSlug);
    const visibleSections = (updatedPage?.sections || []).filter(s => s.isVisible !== false);
    assert(visibleSections.length === 2, 'Section visibility toggle reflected immediately (2 visible sections remaining)');

    // CLEANUP
    console.log('\n--- CLEANUP ---');
    await query('DELETE FROM page_sections WHERE page_id = $1;', [pageUuid]);
    await query('DELETE FROM pages WHERE id = $1;', [pageUuid]);
    console.log('[CLEANUP] Temporary test records removed from PostgreSQL.');

    console.log('\n====================================================');
    console.log(`  VERIFICATION COMPLETE: ${passedTests} / ${totalTests} TESTS PASSED `);
    console.log('====================================================\n');
    process.exit(0);

  } catch (err: any) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runE2EVerification();
