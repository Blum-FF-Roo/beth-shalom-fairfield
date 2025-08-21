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
  
  // Site logo upload
  {
    id: 'site-logo-upload',
    key: 'siteLogoImage',
    title: 'Site Logo Upload',
    description: 'Upload logo image displayed in the header (upper left)',
    type: 'image',
    category: 'logo',
    defaultContent: '/images/logo.png'
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
  },

  // Service pages content sections
  {
    id: 'shabbat-page-content',
    key: 'shabbatPageContent',
    title: 'Shabbat Services Page Content',
    description: 'Main content for the Shabbat services page',
    type: 'rich_text',
    category: 'services',
    defaultContent: `<h2>Welcome to Shabbat</h2>
<p>Shabbat is the cornerstone of Jewish life, a weekly celebration that begins at sundown on Friday and continues until nightfall on Saturday. At Beth Shalom Fairfield, we welcome you to join us for this sacred time of rest, reflection, and community.</p>

<h3>Friday Evening Services</h3>
<p>Our Friday evening services welcome the Shabbat with prayers, songs, and the lighting of Shabbat candles. This intimate service creates a peaceful transition from the week's activities to the sanctity of Shabbat.</p>

<h3>Saturday Morning Services</h3>
<p>Saturday morning services include Torah reading, prayers, and often feature special celebrations such as Bar/Bat Mitzvahs, baby namings, and other lifecycle events. All are welcome to participate in this meaningful worship experience.</p>

<h3>Service Times & Information</h3>
<p>Service times may vary throughout the year. Please contact us for current schedule information and any special Shabbat programs or events.</p>`
  },

  {
    id: 'high-holy-days-page-content',
    key: 'highHolyDaysPageContent',
    title: 'High Holy Days Page Content',
    description: 'Main content for the High Holy Days page',
    type: 'rich_text',
    category: 'services',
    defaultContent: `<h2>Rosh Hashanah & Yom Kippur</h2>
<p>The High Holy Days, also known as the Days of Awe, are the holiest time of the Jewish year. At Beth Shalom Fairfield, we observe these sacred days with meaningful services, reflection, and community celebration.</p>

<h3>Rosh Hashanah - The Jewish New Year</h3>
<p>Rosh Hashanah marks the beginning of the Jewish year and is a time for reflection, repentance, and renewal. We gather to hear the sound of the shofar and celebrate the start of a new year with hope and intention.</p>

<h3>Yom Kippur - The Day of Atonement</h3>
<p>Yom Kippur is the holiest day of the Jewish year, a day of fasting, prayer, and atonement. We come together to seek forgiveness and make amends as we prepare for the year ahead.</p>

<h3>Service Information</h3>
<p>All are welcome to join us for High Holy Day services. Please contact us for specific service times and any special arrangements.</p>`
  },

  {
    id: 'passover-page-content',
    key: 'passoverPageContent',
    title: 'Passover Page Content',
    description: 'Main content for the Passover page',
    type: 'rich_text',
    category: 'services',
    defaultContent: `<h2>Chag Pesach Sameach</h2>
<p>Passover (Pesach) is one of the most significant holidays in the Jewish calendar, commemorating the liberation of the Israelites from slavery in Egypt. At Beth Shalom Fairfield, we celebrate this festival of freedom with community Seders and meaningful observances.</p>

<h3>The Passover Story</h3>
<p>The story of Passover tells of Moses leading the Hebrew people out of bondage in Egypt, guided by God through miraculous signs and wonders. This narrative of liberation continues to inspire people around the world in their own struggles for freedom and justice.</p>

<h3>Community Seder</h3>
<p>Join us for our annual community Seder, where we gather to retell the Passover story, enjoy traditional foods, and celebrate together as one family. Our Seder welcomes people of all backgrounds and levels of Jewish knowledge.</p>

<h3>Passover Observance</h3>
<p>During the eight days of Passover, we remember our ancestors' journey from slavery to freedom by avoiding chametz (leavened products) and eating matzah (unleavened bread), among other traditions that connect us to this pivotal moment in Jewish history.</p>`
  },

  // Articles of Interest page content sections
  {
    id: 'articles-page-header',
    key: 'articlesPageHeader',
    title: 'Articles Page Header',
    description: 'Header text for the Articles of Interest page',
    type: 'text',
    category: 'articles',
    defaultContent: 'Explore thought-provoking articles and insights on Jewish life, tradition, and community.'
  },

  {
    id: 'articles-page-intro',
    key: 'articlesPageIntro',
    title: 'Articles Page Introduction',
    description: 'Introduction text for the Articles of Interest page',
    type: 'rich_text',
    category: 'articles',
    defaultContent: `<p>Welcome to our collection of articles exploring various aspects of Jewish life, tradition, culture, and contemporary issues. These pieces offer insights, perspectives, and discussions that enrich our understanding of our heritage and community.</p>
<p>We invite you to read, reflect, and engage with these thoughtful contributions to Jewish discourse.</p>`
  },

  // All About Judaism page content sections  
  {
    id: 'judaism-page-header',
    key: 'judaismPageHeader',
    title: 'Judaism Page Header',
    description: 'Header text for the All About Judaism page',
    type: 'text',
    category: 'judaism',
    defaultContent: 'Discover the rich traditions, beliefs, and practices of Judaism.'
  },

  {
    id: 'judaism-page-intro',
    key: 'judaismPageIntro',
    title: 'Judaism Page Introduction',
    description: 'Introduction text for the All About Judaism page',
    type: 'rich_text',
    category: 'judaism',
    defaultContent: `<p>Judaism is one of the world's oldest monotheistic religions, with a rich history spanning thousands of years. Here you'll find resources to help you understand Jewish beliefs, practices, holidays, and traditions.</p>
<p>Whether you're new to Judaism or seeking to deepen your knowledge, these resources provide insight into the faith that has sustained our people through millennia.</p>`
  },

  {
    id: 'judaism-basics',
    key: 'judaismBasics',
    title: 'Judaism Basics',
    description: 'Basic information about Judaism',
    type: 'rich_text',
    category: 'judaism',
    defaultContent: `<h3>Core Beliefs</h3>
<p>Judaism is founded on the belief in one, eternal God who created and governs the universe. Central to Jewish belief is the covenant between God and the Jewish people, as well as the importance of ethical behavior and social justice.</p>

<h3>Torah and Sacred Texts</h3>
<p>The Torah, comprising the Five Books of Moses, is the central text of Judaism. Along with the Nevi'im (Prophets) and Ketuvim (Writings), it forms the Tanakh (Hebrew Bible). The Talmud provides commentary and interpretation of Jewish law.</p>

<h3>Jewish Practice</h3>
<p>Jewish practice includes observance of Shabbat, keeping kosher, prayer, study, and celebrating holidays throughout the year. These practices connect Jews to their heritage and community.</p>`
  },

  // Media Archive page content sections
  {
    id: 'media-archive-header',
    key: 'mediaArchiveHeader',
    title: 'Media Archive Page Header',
    description: 'Header text for the Media Archive page',
    type: 'text',
    category: 'media',
    defaultContent: 'Watch video talks and presentations from rabbis and speakers at Congregation Beth Shalom'
  },

  {
    id: 'media-archive-intro',
    key: 'mediaArchiveIntro',
    title: 'Media Archive Introduction',
    description: 'Introduction text for the Media Archive page',
    type: 'rich_text',
    category: 'media',
    defaultContent: `<p>Our media archive contains recordings of meaningful talks, presentations, and discussions that have taken place at Beth Shalom Fairfield. These videos feature rabbis, scholars, and community members sharing insights on Jewish life, tradition, and contemporary issues.</p>
<p>We invite you to explore these recordings and engage with the wisdom and perspectives they offer.</p>`
  },

  // Parshah page content sections
  {
    id: 'parshah-page-header',
    key: 'parshahPageHeader',
    title: 'Parshah Page Header',
    description: 'Header text for the Parshah page',
    type: 'text',
    category: 'parshah',
    defaultContent: 'Weekly Torah Portion - Parashat HaShavua'
  },

  {
    id: 'parshah-page-intro',
    key: 'parshahPageIntro',
    title: 'Parshah Page Introduction',
    description: 'Introduction text for the Parshah page',
    type: 'rich_text',
    category: 'parshah',
    defaultContent: `<p>Each week, Jewish communities around the world read from the same portion of the Torah, called the Parshah or Torah portion. This ancient practice connects Jews across time and geography in shared study and reflection.</p>
<p>Here you'll find insights, commentary, and discussion about the weekly Torah reading, helping to deepen your understanding of these timeless teachings.</p>`
  },

  // Tzedakah/Donate page content sections
  {
    id: 'tzedakah-page-header',
    key: 'tzedakahPageHeader',
    title: 'Tzedakah Page Header',
    description: 'Header text for the Tzedakah/Donate page',
    type: 'text',
    category: 'tzedakah',
    defaultContent: 'Support Our Community Through Tzedakah'
  },

  {
    id: 'tzedakah-page-intro',
    key: 'tzedakahPageIntro',
    title: 'Tzedakah Page Introduction',
    description: 'Introduction text for the Tzedakah page',
    type: 'rich_text',
    category: 'tzedakah',
    defaultContent: `<p>Tzedakah, often translated as charity, is actually closer in meaning to justice or righteousness. It represents our obligation to help others and support our community.</p>
<p>Your generous contributions help maintain our synagogue, support our programs, and ensure that Beth Shalom Fairfield continues to serve our community for generations to come.</p>`
  },

  {
    id: 'donation-info',
    key: 'donationInfo',
    title: 'Donation Information',
    description: 'Information about making donations',
    type: 'rich_text',
    category: 'tzedakah',
    defaultContent: `<h3>Ways to Give</h3>
<p>You can support Congregation Beth Shalom in several ways:</p>
<ul>
<li>Online donations through our secure payment system</li>
<li>Checks made payable to "Congregation Beth Shalom"</li>
<li>In-person donations during services or events</li>
</ul>

<h3>Contact Information</h3>
<p>For questions about donations or to discuss other ways to support our community, please contact us at bethshalomfairfield@gmail.com or call (641) 472-9509.</p>`
  },

  // High Holy Days Sermons page content sections
  {
    id: 'hh-sermons-header',
    key: 'hhSermonsHeader',
    title: 'High Holy Days Sermons Header',
    description: 'Header text for the High Holy Days Sermons page',
    type: 'text',
    category: 'sermons',
    defaultContent: 'High Holy Days Sermons and Teachings'
  },

  {
    id: 'hh-sermons-intro',
    key: 'hhSermonsIntro',
    title: 'High Holy Days Sermons Introduction',
    description: 'Introduction text for the High Holy Days Sermons page',
    type: 'rich_text',
    category: 'sermons',
    defaultContent: `<p>The High Holy Days offer unique opportunities for reflection, repentance, and renewal. Our collection of sermons and teachings from Rosh Hashanah and Yom Kippur services provides insights into these sacred themes.</p>
<p>These messages explore the meaning of the Days of Awe and offer guidance for personal and spiritual growth in the coming year.</p>`
  },

  // Media Links page content sections
  {
    id: 'media-links-header',
    key: 'mediaLinksHeader',
    title: 'Media Links Page Header',
    description: 'Header text for the Media Links page',
    type: 'text',
    category: 'links',
    defaultContent: 'Jewish Resources and Educational Links'
  },

  {
    id: 'media-links-intro',
    key: 'mediaLinksIntro',
    title: 'Media Links Introduction',
    description: 'Introduction text for the Media Links page',
    type: 'rich_text',
    category: 'links',
    defaultContent: `<p>Explore our curated collection of Jewish educational resources, news sources, cultural sites, and learning materials available online.</p>
<p>These links provide access to a wealth of information about Jewish history, culture, practice, and contemporary issues.</p>`
  },

  {
    id: 'educational-links',
    key: 'educationalLinks',
    title: 'Educational Links List',
    description: 'List of educational Jewish resource links',
    type: 'rich_text',
    category: 'links',
    defaultContent: `<h3>Educational Resources</h3>
<ul>
<li><a href="https://www.myjewishlearning.com" target="_blank">My Jewish Learning</a> - Comprehensive Jewish education resource</li>
<li><a href="https://www.chabad.org" target="_blank">Chabad.org</a> - Jewish practice, holidays, and learning</li>
<li><a href="https://www.jewishvirtuallibrary.org" target="_blank">Jewish Virtual Library</a> - Encyclopedia of Jewish history and culture</li>
</ul>

<h3>News and Current Events</h3>
<ul>
<li><a href="https://www.jta.org" target="_blank">Jewish Telegraphic Agency</a> - Jewish news from around the world</li>
<li><a href="https://forward.com" target="_blank">The Forward</a> - Jewish news, culture, and opinion</li>
</ul>

<p><em>Please note: These links are provided for educational purposes. Check with our community for current recommendations and additional resources.</em></p>`
  }
];