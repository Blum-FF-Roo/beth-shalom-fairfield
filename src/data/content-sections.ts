import { ContentSectionDefinition } from '@/types/content';
import { contactInfo, heroSlides } from './site-data';

export const contentSections: ContentSectionDefinition[] = [
  // Home page sections
  {
    id: 'home-about-text',
    key: 'aboutText',
    title: 'About Section Text',
    description: 'Main about text displayed on the home page',
    type: 'rich_text',
    category: 'home',
    defaultContent: `WELCOME TO
CONGREGATION BETH SHALOM
House of Peace
Location: 308 South "B" Street, Fairfield, Iowa 52556
Mailing address: 200 W. Washington Street, Fairfield, Iowa 52556

Beth Shalom Resources:
Membership: To become a member of Congregation Beth Shalom, go to the "BECOME A MEMBER" page for information.

Beth Shalom Newsletter
To receive the weekly Beth Shalom Newsletter or to update your newsletter email address contact us at bethshalomfairfield@gmail.com

The Hebrew Wink (Ben Winkler e-newsletter): reports news, on-going issues and editorials affecting our Jewish community locally, as well as regionally, nationally, internationally and from Israel. To request free subscription, contact Ben Winkler at HBWink@gmail.com

Minyan Club: contact Dean Draznin at dean@drazninpr.com

Yahrzeit plaque: to honor the departed, contact Marc Berkowitz at bethshalomfairfield@gmail.com

Yahrzeit candles: are often available at the synagogue for a small donation.

For further Beth Shalom Information: Call Marc Berkowitz at 472-9509 or email bethshalomfairfield@gmail.com.

Special THANKS to Steven Emanuel Blum for helping to make this website happen. He is a man of many talents.`
  },
  
  // Hero slides
  {
    id: 'home-hero-slides',
    key: 'heroSlides',
    title: 'Hero Slider',
    description: 'Main hero slider images and text on the home page',
    type: 'slide_array',
    category: 'hero',
    defaultContent: heroSlides
  },

  // Programs section toggle
  {
    id: 'home-programs-toggle',
    key: 'programsToggle',
    title: 'Programs Toggle Setting',
    description: 'Toggle between High Holy Days and Passover for the second program',
    type: 'toggle',
    category: 'home',
    defaultContent: 'highHolyDays' // Options: 'highHolyDays' or 'passover'
  },

  // About page sections
  {
    id: 'about-administration',
    key: 'aboutAdministration',
    title: 'Administration Section',
    description: 'Administration information on the About page',
    type: 'rich_text',
    category: 'about',
    defaultContent: `<h2>ADMINISTRATION</h2>
<div class="grid md:grid-cols-2 gap-4">
<p><strong>President:</strong> Marc Berkowitz</p>
<p><strong>Administrator:</strong> Susan Berkowitz</p>
<p><strong>Vice President:</strong> Dean Draznin</p>
<p><strong>Vice President:</strong> Sol Waksman</p>
<p><strong>Secretary:</strong> Lisa Cohen</p>
<p><strong>Treasurer:</strong> Fred Swartz</p>
</div>`
  },

  {
    id: 'about-board-members',
    key: 'aboutBoardMembers',
    title: 'Board Members',
    description: 'Board members list on the About page',
    type: 'list',
    category: 'about',
    defaultContent: [
      'Marc Berkowitz',
      'Dean Draznin', 
      'Sol Waksman',
      'Lisa Cohen',
      'Fred Swartz',
      'Danella Lubar',
      'Steve Sufian',
      'Brian Teitzman',
      'Scott Terry'
    ]
  },

  {
    id: 'about-committees',
    key: 'aboutCommittees',
    title: 'Committees',
    description: 'Committees information on the About page',
    type: 'rich_text',
    category: 'about',
    defaultContent: `<p><strong>Building:</strong> Sol Waksman, Bill Pollak</p>
<p><strong>High Holiday:</strong> Lewis Denbaum – Aliyot and Honors</p>
<p><strong>Torah Service:</strong> Lewis Denbaum and Marc Berkowitz</p>
<p><strong>Newsletter:</strong> Marc Berkowitz, Editor-In-Chief</p>
<p><strong>Religious Committee:</strong> David Matt, Bob Rabinoff</p>
<p><strong>Set-up:</strong> Lisa and David Cohen (and family)</p>
<p><strong>Volunteers:</strong> Brian Teitzman</p>`
  },

  {
    id: 'about-resources',
    key: 'aboutResources',
    title: 'Beth Shalom Resources',
    description: 'Resources section on the About page',
    type: 'rich_text',
    category: 'about',
    defaultContent: `<p><strong>Beth Shalom Newsletter:</strong> To receive the weekly Beth Shalom Newsletter or to update your newsletter email address contact us at bethshalomfairfield@gmail.com</p>
<p><strong>The Hebrew Wink (Ben Winkler e-newsletter):</strong> reports news, on-going issues and editorials affecting our Jewish community locally, as well as regionally, nationally, internationally and from Israel. To request free subscription, contact Ben Winkler at HBWink@gmail.com</p>
<p><strong>Minyan Club:</strong> contact Dean Draznin at dean@drazninpr.com</p>
<p><strong>Yahrzeit plaque:</strong> to honor the departed, contact Marc Berkowitz at 472-9509 or email bethshalomfairfield@gmail.com</p>
<p><strong>Yahrzeit candles:</strong> are available at the synagogue for a small donation.</p>
<p><strong>Information:</strong> Contact Marc Berkowitz at 472-9509 or email bethshalomfairfield@gmail.com</p>`
  },

  {
    id: 'about-community-message',
    key: 'aboutCommunityMessage',
    title: 'Community Message',
    description: 'Community message by Fred Swartz on the About page',
    type: 'rich_text',
    category: 'about',
    defaultContent: `<p>On these special occasions, where we come together as a Jewish community, we particularly appreciate being able to have our own Synagogue, a place to pray to together, to celebrate together, and to affirm our faith. Even though we know that God is everywhere, when we come together to pray just as our ancestors have done for thousands of years, we are enlivening Abraham's covenant with God, for all Jews for all time, and enlivening our own relationship with God.</p>

<p>Having our own Synagogue makes a statement that we honor and support our tradition and will preserve it for generations to come. It dignifies our experience of our rituals in a place of holiness maintained through prayer and the Ark containing the Torahs. It also provides a place for our library, our Sunday School, adult education classes, weddings, funerals, bar and bat mitzvah's, and holiday celebrations.</p>

<p>This synagogue is maintained by volunteers who contribute their time and energy because they recognize the benefit of having our own house of worship and preserving our Jewish heritage. Our Synagogue is an important part of our Jewish community. The Board of Directors of the Synagogue encourages each of you to become a member of Congregation Beth Shalom. Even if you pay the membership dues in installments over the year, becoming a member supports our community. We are always asked by visitors, "How many members do you have?" because they know this is one measure of the strength of our group consciousness. This is one important way that you can help us continue to maintain the Synagogue, to continue our traditions which connect us to our forefathers, and help support our rare and precious Jewish community.</p>

<p>Thank you to those of you who have already become members this year, and we invite everyone else to please join us in preserving what we enjoy here on all of these special occasions.</p>`
  },

  // Contact page sections  
  {
    id: 'contact-info',
    key: 'contactInfo',
    title: 'Contact Information',
    description: 'Contact details displayed on contact page',
    type: 'contact',
    category: 'contact',
    defaultContent: contactInfo
  },

  {
    id: 'contact-page-header',
    key: 'contactPageHeader',
    title: 'Contact Page Header',
    description: 'Header text on the contact page',
    type: 'text',
    category: 'contact',
    defaultContent: "We'd love to hear from you. Get in touch with Beth Shalom Fairfield."
  },

  // Membership page sections
  {
    id: 'membership-intro',
    key: 'membershipIntro',
    title: 'Membership Introduction',
    description: 'Introduction text on the membership page',
    type: 'rich_text',
    category: 'membership',
    defaultContent: `<p>One way to contribute to Congregation Beth Shalom is to pay dues and become a member. As a member you are entitled to High Holiday tickets, the catered Break-fast, and discounts on many other activities throughout the year.</p>

<p>By becoming a member you are basically saying "I want the synagogue to be here for those who wish to participate and for me if I ever need it for any reason." And YES dues can be paid in installments.</p>`
  },

  {
    id: 'membership-info',
    key: 'membershipInfo',
    title: 'Membership Information',
    description: 'Membership submission information on the membership page',
    type: 'rich_text',
    category: 'membership',
    defaultContent: `<p>E-MAIL OR MAIL YOUR MEMBERSHIP INFORMATION TO:</p>
<div class="space-y-2 mb-6">
<p><strong>Address:</strong> Congregation Beth Shalom, c/o 200 W. Washington, Fairfield, Iowa 52556.</p>
<p><strong>E-Mail:</strong> bethshalomfairfield@gmail.com</p>
</div>

<div class="space-y-2">
<p>MEMBERSHIP CATEGORY:</p>
<p>NAME OF MEMBER(s):</p>
<p>AMOUNT PAID:</p>
<p>YOUR MAILING ADDRESS:</p>
<p>YOUR E-MAIL ADDRESS:</p>
</div>`
  },

  {
    id: 'membership-community-message',
    key: 'membershipCommunityMessage',
    title: 'Membership Community Message',
    description: 'Community message on the membership page',
    type: 'rich_text',
    category: 'membership',
    defaultContent: `<p>On these special occasions, where we come together as a Jewish community, we particularly appreciate being able to have our own Synagogue, a place to pray to together, to celebrate together, and to affirm our faith. Even though we know that God is everywhere, when we come together to pray just as our ancestors have done for thousands of years, we are enlivening Abraham's covenant with God, for all Jews for all time, and enlivening our own relationship with God.</p>

<p>Having our own Synagogue makes a statement that we honor and support our tradition and will preserve it for generations to come. It dignifies our experience of our rituals in a place of holiness maintained through prayer and the Ark containing the Torahs. It also provides a place for our library, our Sunday School, adult education classes, weddings, funerals, bar and bat mitzvah's, and holiday celebrations.</p>

<p>This synagogue is maintained by volunteers who contribute their time and energy because they recognize the benefit of having our own house of worship and preserving our Jewish heritage. Our Synagogue is an important part of our Jewish community. The Board of Directors of the Synagogue encourages each of you to become a member of Congregation Beth Shalom. Even if you pay the membership dues in installments over the year, becoming a member supports our community. We are always asked by visitors, "How many members do you have?" because they know this is one measure of the strength of our group consciousness. This is one important way that you can help us continue to maintain the Synagogue, to continue our traditions which connect us to our forefathers, and help support our rare and precious Jewish community.</p>

<p>Thank you to those of you who have already become members this year, and we invite everyone else to please join us in preserving what we enjoy here on all of these special occasions.</p>`
  }
];