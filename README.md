I want to change the existing ModularHome desktop navigation into a PRODUCT MEGA-MENU system.

IMPORTANT:
Do NOT redesign the entire Navbar.
Do NOT remove the existing 3-layer header.
Do NOT change the existing brand colors, typography, logo, search, account, cart, quote CTA, or mobile drawer unnecessarily.

Use the uploaded reference screenshot as the visual/UX reference.

REFERENCE BEHAVIOR:

When the user clicks a top-level category such as:

- Modular Homes
- Prefab Homes
- Barndominiums
- House Kits
- Tiny Homes
- Park Models
- Cabins
- ADUs & Granny Pods
- A-Frames
- Commercial

open a large mega-menu directly below the navigation bar.

The mega-menu should contain:
1. Product/category links on the left
2. A featured product/content card on the right
3. An "Explore All [Category]" link
4. Real product images from Supabase
5. Real product names from Supabase

Do NOT immediately navigate when clicking the top-level category.

The category page should be accessible through:
"Explore All [Category] →"

==================================================
VISUAL REFERENCE
==================================================

The mega-menu should resemble the supplied screenshot:

- Full-width dropdown below the navigation
- White background
- Clean architectural/premium appearance
- Large horizontal layout
- Left side: product links
- Right side: featured image
- Subtle shadow/border
- Generous whitespace
- Manrope typography
- Existing ModularHome gold accent
- Smooth opening animation
- No excessive rounded cards
- No clutter

Example:

------------------------------------------------------------

Cabins

The Cub Cabin
The Rustic Charm Cabin (NEW MODEL)
The Mountain Nest Cabin – Luxury Log Home Kit
The Puma Cabin – Luxury Log Home Kit
The Gatlinburg Lodge Cabin
Explore All Cabins →

                                      ┌─────────────────┐
                                      │                 │
                                      │ Featured Image  │
                                      │                 │
                                      └─────────────────┘
                                      Modular Cabins...
                                      View Cabin →

------------------------------------------------------------

==================================================
DATA ARCHITECTURE
==================================================

DO NOT hard-code product names in Navbar.tsx.

Use the existing Supabase/publicData.ts/data access layer.

The structure should conceptually be:

Top-level category
        ↓
Category identifier
        ↓
Supabase products
        ↓
Select featured/popular products
        ↓
Mega menu

Reuse existing database queries where possible.

Do not create a second independent product-fetching system if an existing reusable function already exists.

==================================================
CATEGORY CONFIGURATION
==================================================

Create or reuse a canonical configuration similar to:

const megaMenuCategories = [
  {
    label: "Modular Homes",
    category: "Modular Homes",
    href: "/buildings?category=Modular+Homes",
  },
  {
    label: "Prefab Homes",
    category: "Prefab Homes",
    href: "/buildings?category=Prefab+Homes",
  },
  {
    label: "Barndominiums",
    category: "Barndominiums",
    href: "/buildings?category=Barndominiums",
  },
  {
    label: "House Kits",
    category: "House Kits",
    href: "/buildings?category=House+Kits",
  },
  {
    label: "Tiny Homes",
    category: "Tiny Homes",
    href: "/buildings?category=Tiny+Homes",
  },
  {
    label: "Park Models",
    category: "Park Models",
    href: "/buildings?category=Park+Models",
  },
  {
    label: "Cabins",
    category: "Cabins",
    href: "/buildings?category=Cabins",
  },
  {
    label: "ADUs & Granny Pods",
    category: "ADUs & Granny Pods",
    href: "/buildings?category=ADUs+%26+Granny+Pods",
  },
  {
    label: "A-Frames",
    category: "A-Frame Homes",
    href: "/buildings?category=A-Frame+Homes",
  },
  {
    label: "Commercial",
    category: "Commercial Buildings",
    href: "/buildings?category=Commercial+Buildings",
  },
];

IMPORTANT:
Inspect the actual Supabase category values before using these strings.
Do not assume the displayed label and database category are identical.

==================================================
MEGA MENU CONTENT
==================================================

For every category:

1. Query relevant products.
2. Select a small number of representative products.
3. Prefer:
   - featured products
   - newest products
   - popular products
   - products with valid images
4. Display approximately 5-6 product links.
5. Display one featured product/image.
6. Add "Explore All [Category]".

Example for Cabins:

The Cub Cabin
The Rustic Charm Cabin (NEW MODEL)
The Mountain Nest Cabin – Luxury Log Home Kit
The Puma Cabin – Luxury Log Home Kit
The Gatlinburg Lodge Cabin

Explore All Cabins →

The exact products MUST come from Supabase.

Do not fabricate names.

==================================================
FEATURED IMAGE
==================================================

The right side should display the selected category's featured product.

Use the real product image from Supabase.

Image requirements:

- aspect ratio approximately 4:3 or 16:10
- object-cover
- rounded corners only if consistent with current design
- lazy loading unless the browser requires otherwise
- meaningful alt text
- graceful fallback when image is missing

If no valid image exists:
show a clean fallback instead of a broken image.

==================================================
INTERACTION
==================================================

Top-level category behavior:

CLICK:
Open mega menu.

CLICK SAME CATEGORY:
Close mega menu.

CLICK ANOTHER CATEGORY:
Close current menu and open the newly selected category.

CLICK OUTSIDE:
Close mega menu.

PRESS ESC:
Close mega menu.

CLICK PRODUCT:
Navigate to product page and close menu.

CLICK "Explore All":
Navigate to category page and close menu.

HOVER:
Do NOT make hover the only way to access the menu.

The primary interaction must be CLICK.

This is important for mobile/tablet accessibility.

==================================================
ANIMATION
==================================================

Use a subtle animation:

- opacity
- translateY
- small scale if appropriate

Duration approximately:

150-250ms

Do not use excessive animation.

Avoid layout shift.

==================================================
NAVBAR POSITIONING
==================================================

The mega menu must appear directly underneath the category navigation.

It should:

- align with the navbar
- have sufficient z-index
- not appear behind hero content
- not create horizontal overflow
- not break sticky positioning

Check:

z-index
positioning
overflow
sticky header

==================================================
ACTIVE STATE
==================================================

When a mega menu is open:

The selected category should receive the existing active/highlight treatment.

For example:

bg-amber-50
text-[#b45309]
ring-1 ring-amber-300

Use the project's existing design tokens.

==================================================
DESKTOP
==================================================

Implement the mega menu for desktop/tablet widths where the horizontal navigation is available.

Suggested breakpoint:

>= 1024px

At smaller widths, keep the existing mobile drawer.

==================================================
MOBILE
==================================================

Do NOT use the desktop mega menu on mobile.

Keep the existing mobile drawer.

However, improve the mobile drawer if necessary so each category can expand to show its products.

Example:

Cabins
  >
    The Cub Cabin
    The Rustic Charm Cabin
    The Mountain Nest Cabin
    Explore All Cabins

The mobile version should remain compact and usable.

Do not load a huge number of products into the mobile drawer.

==================================================
PERFORMANCE
==================================================

IMPORTANT:

Do not fetch every product for every category when the navbar loads.

Avoid:

10 categories × hundreds of products

Instead:

- Fetch only a small number of products per category.
- Use existing server-side/public data utilities.
- Cache where appropriate.
- Consider loading mega-menu content when the user opens a category.
- Do not block initial page rendering with unnecessary product queries.

The navbar should remain fast.

==================================================
EMPTY CATEGORY
==================================================

If a category contains no products:

Do NOT show a blank mega menu.

Show:

"No featured homes available yet."

and:

"Explore All [Category] →"

==================================================
IMAGE FAILURE
==================================================

If featured image fails:

- hide broken image
- show fallback
- keep title and CTA functional

No broken image icons.

==================================================
ACCESSIBILITY
==================================================

Implement:

- keyboard accessible menu buttons
- aria-expanded
- aria-controls
- proper button elements
- Escape handling
- focus behavior
- visible focus states

Example:

<button
  aria-expanded={openCategory === category.label}
>

Do not use div elements as clickable buttons.

==================================================
IMPORTANT EXISTING FUNCTIONALITY
==================================================

Preserve:

- logo
- search
- account
- cart
- quote CTA
- upload floor plan
- top utility bar
- social icons
- customer login state
- admin navigation suppression
- mobile drawer
- active route detection
- CMS navigation
- existing Supabase authentication

Do not break these.

==================================================
RECOMMENDED COMPONENT STRUCTURE
==================================================

If appropriate, create reusable components:

src/components/navigation/
    MegaMenu.tsx
    MegaMenuCategory.tsx
    MegaMenuProductList.tsx
    MegaMenuFeaturedCard.tsx

But first inspect the existing architecture.

Do not create duplicate components if equivalent components already exist.

Navbar.tsx should remain reasonably maintainable.

==================================================
EXAMPLE COMPONENT BEHAVIOR
==================================================

Conceptually:

const [openCategory, setOpenCategory] = useState<string | null>(null);

Click:

setOpenCategory(
  openCategory === category.label
    ? null
    : category.label
);

Then:

{openCategory && (
  <MegaMenu
    category={openCategory}
  />
)}

The actual implementation should follow the existing project's architecture.

==================================================
IMPORTANT: DO NOT HARD-CODE THE SCREENSHOT
==================================================

The screenshot is a DESIGN REFERENCE.

Do NOT hard-code:

"The Cub Cabin"
"The Rustic Charm Cabin"
etc.

unless those products actually exist in the database.

Use real Supabase data.

==================================================
TESTING
==================================================

After implementation test every category:

Modular Homes
Prefab Homes
Barndominiums
House Kits
Tiny Homes
Park Models
Cabins
ADUs & Granny Pods
A-Frames
Commercial

For every category verify:

- click opens menu
- correct products
- correct image
- product link works
- Explore All works
- outside click closes
- ESC closes
- another category switches menu
- no console errors
- no horizontal overflow

Also test:

- desktop
- tablet
- mobile
- logged out
- logged in
- admin routes

==================================================
FINAL RESULT
==================================================

The desired user experience is:

User sees:

Modular Homes | Prefab Homes | Barndominiums | House Kits | ... | Cabins

User clicks:

Cabins

↓

Large premium mega menu opens.

↓

Left:
Real cabin products from Supabase.

↓

Right:
Featured cabin image + information.

↓

User clicks a product:
Product page opens.

OR

User clicks:
Explore All Cabins →

↓

/buildings?category=Cabins

The result should feel like a premium architectural/modular-home website and closely follow the supplied screenshot's interaction pattern while using the existing ModularHome design system.

Before modifying files, inspect the existing Navbar.tsx and data-access functions and identify the minimum files that need to change.

Do not redesign unrelated parts of the application.