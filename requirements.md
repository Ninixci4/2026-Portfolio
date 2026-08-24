# Portfolio Website Requirements

## Project Overview
A personal portfolio website showcasing work, experience, and skills with a modern design featuring purple gradient themes and dark/light mode toggle.

## Color Theme
- Primary Colors:
  - `#29264c` - Dark purple/navy
  - `#501f5b` - Deep purple
  - `#794c9e` - Medium purple
  - `#8f7ab8` - Light purple
  - `#b89ac9` - Pale purple
  - `#f9cbdf` - Pink-purple gradient accent

- Buttons and accents should use gradient combinations of these purple shades
- "Amazing" text in contact page should use gradient color of the theme

## Theme Toggle
- Dark/Light theme toggle button positioned at the top of the page
- Should persist user preference across page navigation

## Header Navigation
The header should contain the following navigation links:
- Home
- About
- Works
- Experience
- Certifications
- Contact

## Pages

### 1. Home Page

#### Left Side:
- Main heading: "Hi, I am Nicia"
- Subheading: "Web Designer and UI/UX designer"
- Short description about role
- Keywords/tags: web, mobile, ui/ux, design
- Two buttons:
  1. "View my work"
  2. "let's create something"
- Buttons styled with purple gradient theme

#### Right Side:
- Slideshow gallery displaying 3 pictures
- Auto-rotating or manual navigation controls

---

### 2. About Page

#### Top Section (Split Layout):
- **Left Side:** Image/photo
- **Right Side:**
  - Name: "Nichole Tricia R. Perez"
  - Keywords: Web Developer, UI/UX Designer, IT Enthusiast
  - Intro text area (placeholder for user input)
  - Description text area (placeholder for user input)

#### Middle Section - Soft Skills:
- 4 cards displaying soft skills
- Each card contains:
  - Icon
  - Skill name (e.g., "Clear Communication")
- Cards arranged in grid layout

#### Bottom Section - "WHY WORK WITH ME?":
- Section title in purple color
- Short introductory text
- 4 cards arranged in 2x2 grid
- Each card contains:
  - Icon
  - Title
  - Description

---

### 3. Works Page

- **Title:** "Featured Works"
- **Introduction:** "A collection of projects that showcase my skills and creativity."
- **Project Cards:**
  - Clickable cards displaying projects
  - Each card contains:
    - Picture/image
    - Picture overlay label indicating type: "web app", "mobile app", "figma", etc.
    - Title
    - Description
    - Keywords/tags

- **Project Detail View (On Click):**
  - Expands like an album/gallery view
  - Right side panel displays:
    - Full project title
    - Full description
    - Tech stack
    - Buttons:
      - "View live site" (if applicable)
      - "Close project" button
  - Purple accent colors throughout

---

### 4. Experience Page

- **Title:** "Experience"
- **Subtitle/Message:** "Building real-world solutions and growing professionally."
- **Design:** Timeline format
- **Animation:** On scroll, timeline items ease in and appear
- **Timeline Items:** (3 sample experiences)
  - Each item contains:
    - Icon
    - Experience title
    - Year
    - Bullet points describing the experience

---

### 5. Certifications Page

- **Title:** "Certifications & Seminars"
- **Introduction:** "A snapshot of my continuous learning and involvement"
- **Certification Cards:**
  - Arranged in 2-column grid layout
  - Each card contains:
    - Icon
    - Category keyword (e.g., "UI/UX", "Front-end", etc.)
    - Certification/seminar title
    - Issuing organization/institution
    - Date
    - Location
  - Cards are clickable
  - On click: Card enlarges and displays the certificate image/picture

---

### 6. Contact Page

- **Title:** "Let's Create Something Amazing"
  - Word "Amazing" should be in gradient color (using theme colors)
- **Introduction:** "Have an idea, project, or just want to connect? I'd love to hear from you."

#### Layout (Split):
- **Left Side - Contact Information:**
  - Email
  - Phone
  - Facebook
  - Social Media Icons (at bottom):
    - GitHub (clickable, redirects to account)
    - LinkedIn (clickable, redirects to account)
    - Instagram (clickable, redirects to account)

- **Right Side - Contact Form:**
  - Form fields for sending message
  - Form submissions sent to: `pereznicholetricia@gmail.com`

---

## Technical Stack

### Core Technologies:
- HTML
- CSS
- JavaScript

### Services:
- EmailJS - For handling email submissions in contact form

### Libraries:
- jQuery

---

## Additional Requirements

### Design Considerations:
- Responsive design for mobile and desktop
- Smooth scrolling and transitions
- Interactive elements with hover effects
- Purple gradient theme applied consistently throughout
- Dark/light theme should affect all color schemes appropriately

### Functionality:
- Dark/light theme toggle with persistent preference
- Form validation for contact form
- Smooth page transitions/navigation
- Image gallery/slideshow functionality
- Expandable project cards
- Expandable certification cards
- Timeline scroll animations
- Email integration via EmailJS

### User Experience:
- Clear navigation structure
- Intuitive interactions
- Visual feedback on interactive elements
- Accessible design considerations
- Fast loading times

---

## Notes

- Some personal information (name variations: "Nicia" vs "Nichole Tricia R. Perez") should be confirmed for consistency
- All text areas marked for user input should be easily editable
- Images and content placeholders should be prepared by the developer
- Social media links need actual URLs/accounts to be provided
- EmailJS requires API key configuration
