import { createContentSection } from '@/lib/content-schema';
import { ContentSection } from '@/types/content';

// All content sections to be created
const allContentSections = [
  // HISTORY SECTIONS (5 sections)
  {
    key: 'historyIntro',
    title: 'History Introduction',
    description: 'Introduction section for the history page',
    type: 'rich_text' as const,
    category: 'history' as const,
    content: `<p>In 2006, Margo Baum collected reminiscences of a number of members of Congregation Beth Shalom who have been here since the "early days." Collectively they make up, if not a history, at least an impression of what the Jewish community and Congregation Beth Shalom were like from the mid-1970s to 2007.</p>`,
    isEditable: true
  },
  {
    key: 'historyEarlyDays',
    title: 'History - Early Days',
    description: 'Early days section of the congregation history',
    type: 'rich_text' as const,
    category: 'history' as const,
    content: `<p>"A group of ten or twelve of us went to Rosh Hashanah services in Ottumwa. None of us had been in Iowa before. These older people — in their 50's and 60's — were so excited to see a group of young people. They fought over who would take us for Rosh Hashanah and break fast for Yom Kippur," reminisces June Schindler of her first touch of Judaism in Iowa in 1974.</p>

<p>According to legend, there were only 1½ Jewish families in Fairfield at this time — the Silverman's and one half of another Jewish couple. I believe it may have been Paula Rackoff and I think she may have run for city or county office. Parsons College had now become Maharishi International University (MIU) where a group of Jewish meditating faculty and students became the foundation for the Fairfield Jewish congregation — Congregation Beth Shalom, or, "House of Peace." But, where was the "House"?</p>

<p>Like their tribal ancestors, during the 1970's the Fairfield congregation was a nomadic group on the MIU campus (now Maharishi University of Management), going from Barhydt Chapel, to "pod" basements (those curious little odd-shaped campus residence buildings, subsequently destroyed), to frat houses, to Howard Dinning Hall and to the Student Union. They also congregated in the homes of Artie and Pam Robinson, and Jeff and Carin Cohen.</p>`,
    isEditable: true
  },
  {
    key: 'historyFoundation',
    title: 'History - Foundation and Leadership',
    description: 'Foundation and leadership section of the congregation history',
    type: 'rich_text' as const,
    category: 'history' as const,
    content: `<p>Michael Mescon remembers attending a service in the balcony of Barhydt Chapel with about 15 others in 1974 when he was a student. He says they gathered there because "That's where the ark was." It was "A little wooden portable ark made out of plywood," remembers Bob Rabinoff who became the congregation's first president. June Schindler recalls that "The handles were broken on the Torah and had to be repaired. We worried about the type of glue that was used." Apparently, Parsons, which was Presbyterian in affiliation but had a branch of the Hillel Foundation, had left a Torah with the building; two other Torahs were donated to the group at a later time.</p>

<p>June recalls Chucky Blitz leading services in Barhydt. "And at the end of one service, David Sands ran in to have a baby naming," she states, referring to the newborn, Eve. There were a variety of service leaders including Chucky, Bob Rabinoff, Jan Kirschner and Artie Robinson. Bob says, "Nobody knew how to run services. It was the land of the blind." However, there were many contributors to the cause of leading the blind, including Phil Fox.</p>

<p>"Phil came from Poland to the United States in 1936. He taught us a lot, just traditional Jewish customs — how to daven, how to pray. We had muddled our way through and he was a big positive influence. He showed us the way a real synagogue functioned — leading services correctly. He taught us what portions to read at Yom Kippur and how to do "tashlich."</p>

<p>Bob also remembers, "Manis Friedman, a Chabad rabbi in Minneapolis who came down and gave lectures on Judaism. He showed me how to lay tefillin." A meditating cantorial student became our cantor and taught Bob the Torah trope.</p>

<p>Finally, in the early 1980's during a service in the "pod," David Matt felt the desire to keep in the tradition of the long line of rabbis in his family; he offered to lead services. "I saw that I was really the only one in the congregation who had been trained to lead High Holy Day services so I volunteered." He started out helping Artie Robinson and by reading portions of the Torah. Within a year or two he became the synagogue's official religious leader.</p>`,
    isEditable: true
  },
  {
    key: 'historyBuilding',
    title: 'History - Finding Our Home',
    description: 'Building and finding our home section of the congregation history',
    type: 'rich_text' as const,
    category: 'history' as const,
    content: `<p>As more and more Jewish families moved to Fairfield, a bigger space was needed to hold the congregation — especially for High Holy Days. According to Chaya Green, formerly Katy Rabinoff, "space on campus became crowded and MIU was shifting us from place to place." She felt that we should find our own building.</p>

<p>Chaya says, "I kept my eyes open for a golden opportunity. Then Jane and Barry Pitt's son, Jesse, and some other young people had upcoming bar mitzvahs. I knew this could galvanize people and I asked to call a meeting at their house. This became the foundation for getting our own synagogue. Bill Pollak showed up."</p>

<p>In 1984 Bill, who later became the congregation's second president, became aware that a church on B Street was for sale. He says, "The church was a glove factory that the Baptists had bought. It had a baptismal in the back of the sanctuary — a big tub, that was pulled out when it was sold." A decision was made to buy the building, even if the old glove factory did not fit like a — well, like a glove.</p>

<p>At the time of purchase, the sanctuary faced west — the wrong direction for traditional Jewish prayer. "Initially there was a door directly into the sanctuary from the front hall — where the ark is now. We wanted to have the sanctuary more quiet and private and we also wanted the ark to be in the right position facing east, so that change was made fairly early," says Julie Blum. She remembers that, "Handy members of the synagogue did a lot of work — especially Bill Pollak and Steve Blum. There was a small group of dedicated men who helped with whatever needed to be done, including Nathan Zenack, Bob Rabinoff and Brian Teitzman."</p>`,
    isEditable: true
  },
  {
    key: 'historyGrowth',
    title: 'History - Growth and Community',
    description: 'Growth and community section of the congregation history',
    type: 'rich_text' as const,
    category: 'history' as const,
    content: `<p>Monthly funds for purchasing the building came from membership dues and donations. Julie says there was a good response from the community to have our own building. Early and generous financial supporters included: Joseph and Ann Berman, Warren and Harriet Berman, Richard and Judy Eisner, Bill and Leslie Elkus, Steven and Gillian Foster, Bernard and Lillian Freeman, Marc and Marci Freeman, Jay Glazer, Joel and Joy Hirshberg, Michael and Miriam Mescon, Barry and Jane Pitt, Irving and Sarah Pitt, Bill and Brenda Pollak, Fred and Debra Poneman, Bob and Katy Rabinoff, Jonathan Sabin, Fred and Janet Swartz, Phillip and Dorothy Swartz, David A. Tapper, Brian and Bernadette Teitzman, David Vatz, and Nathan and Marie Zenack.</p>

<p>Julie recalls, "Interest was strong because many families had young children at the time. Having traditional religious instruction for our children was very important to many people." Towards the end of our monthly payments, the Berman family generously paid off the balance.</p>

<p>After moving into our new home Bill Pollak presented his family's Torah to the congregation. Bill explains, "My grandfather paid to have this Torah made; it was presented to the synagogue 'Beth Jacob' in New York the day my father was bar mitzvahed. It stayed there until the neighborhood died and the synagogue gave it back to my parents. My parents, in turn, thought it was most safe with me."</p>

<p>Janet and David Adelson also donated a koshered Torah. Because these Torahs needed a new ark, Shai Perelson, who had moved here from Israel, generously created one. The bema and our original prayer books were donated by Agudas Achim, Rabbi Jeff Portman's synagogue in Iowa City.</p>

<p>The building was redecorated with inspiration from interior designer Susan Berkowitz. And as Chaya Green had envisioned, young people began to be called to the Torah in the new synagogue. Jonathan Freeman was the first young man to have a bar mitzvah at Congregation Beth Shalom, followed by Jennie Rothenberg with the first bat mitzvah. Jesse Pitt followed soon thereafter.</p>

<p>The bar mitzvah kid so far most famous is Hollywood actor Ben Foster. Many of the boys and girls studied Hebrew with Freida Adler from Israel, renowned for her great organizing power and for having sold millions in Israel bonds when the Jewish state was founded.</p>

<p>With the purchase of the building, the organization of running the synagogue became more formalized. Bill recalls that every week, a committee met at the Mescons to hammer out by-laws. Michael Mescon created a newsletter that he typed on a 286 computer in 8 and 11 pin. He remembers, "I typed in every single address." Another essential group that formed was the sisterhood.</p>

<p>Julie Blum, June Schindler, Miriam Mescon, Brenda Pollak, Marcy Gritz, and Katy Rabinoff (Chaya Green) founded the sisterhood. They organized the first event held in the synagogue – a kitchen shower. "Everybody brought things for the kitchen," says Brenda.</p>

<p>"We raised money selling challah to buy a new refrigerator," June remembers. According to Chaya and June, the sisterhood ran the programming, koshered the kitchen and did the cooking. Friday night services were held, along with potluck dinners. The sisterhood took turns making challah. Miriam says, "We came together to learn to make challah. We marveled at how different it was when each person made it from the same recipe."</p>

<p>The big draw on Friday nights was the kids when 30 to 50 families showed up. In order to help ensure the safety of the children, a fence was erected around the perimeter of the playground. Dorit Har from Israel founded the Sunday School and continued as principal for many years. Brenda Pollak, Julie Blum, and Michael Mescon among others, were also active in the Sunday School in its heyday, when there were around 40 students.</p>

<p>As the Jewish community expanded, businesses in town began to cater to our needs. Miriam Mescon says that, initially, her parents would send bagels and matzahs. "We had to go to Eagles in Iowa City to buy supplies for Passover. Bruegger's had bagels. We all learned how to make mock (vegetarian) chicken soup. But in time, we went from having no bagels in Fairfield to a good supply of bagels, and from having no candles anywhere to finding Hanukkah and Yarzheit candles routinely stocked at HyVee and Econo foods."</p>

<p>Today, as a result of the work of Marc Berkowitz, our third president, many merchants in town have Chanukah menorahs on display during the holiday season, to show, in part, their willingness to include the Jewish community. And, thanks to Lewis Denbaum who promoted and the Silverman's who provided, the Chamber of Commerce has a large Chanukah menorah displayed prominently on the Square with the other holiday symbols and decorations each December.</p>

<p>A major impetus for growth of Jewish life in Fairfield over the years has been the inspiring and deeply insightful dvar Torahs shared by members. Regular contributors on Torah in the light of consciousness include Dean Draznin, Steve Druker, Evan Finkelstein, Joy Hirshberg, Bob Markowitz, and Fred Swartz.</p>

<p>Additional inspiration and guidance comes from visiting rabbis: Rabbi Alan Green (Winnipeg, Canada), Rabbi Jonathan Magidovitch (Highland Park, IL), Rabbi Yossi Jacobson (Des Moines, IA), and Rabbi Aran Schimmel (Postville, IA).</p>

<p>With the advent of email, Joy Hirshberg, our fourth president, is able to share regular insights and inspiration with members and supporters in Fairfield and across the US, as well as internationally. And it is the advent of the internet which has inspired this history for our website.</p>

<p>From the 1½ Jewish families in Fairfield and then the original 15 members of Congregation Beth Shalom in Barhydt Chapel at Maharishi International University, the Fairfield Jewish community has grown to more than 150 families with their own synagogue at 308 South B Street in Fairfield, and a vibrant collective consciousness.</p>

<p><strong>Gai Gezunthayt.</strong></p>`,
    isEditable: true
  },

  // SHABBAT SECTIONS (3 sections)
  {
    key: 'shabbatIntro',
    title: 'Shabbat Introduction',
    description: 'Introduction and welcome to Shabbat services',
    type: 'rich_text' as const,
    category: 'shabbat' as const,
    content: `<h2>Welcome to Shabbat</h2>
<p>Shabbat is the cornerstone of Jewish life, a weekly celebration that begins at sundown on Friday and continues until nightfall on Saturday. At Beth Shalom Fairfield, we welcome you to join us for this sacred time of rest, reflection, and community.</p>`,
    isEditable: true
  },
  {
    key: 'shabbatServices',
    title: 'Shabbat Services',
    description: 'Information about Friday evening and Saturday morning services',
    type: 'rich_text' as const,
    category: 'shabbat' as const,
    content: `<h3>Friday Evening Services</h3>
<p>Our Friday evening services welcome the Shabbat with prayers, songs, and the lighting of Shabbat candles. This intimate service creates a peaceful transition from the week's activities to the sanctity of Shabbat.</p>

<h3>Saturday Morning Services</h3>
<p>Saturday morning services include Torah reading, prayers, and often feature special celebrations such as Bar/Bat Mitzvahs, baby namings, and other lifecycle events. All are welcome to participate in this meaningful worship experience.</p>`,
    isEditable: true
  },
  {
    key: 'shabbatTimes',
    title: 'Shabbat Service Times',
    description: 'Service times and contact information',
    type: 'rich_text' as const,
    category: 'shabbat' as const,
    content: `<h3>Service Times & Information</h3>
<p>Service times may vary throughout the year. Please contact us for current schedule information and any special Shabbat programs or events.</p>`,
    isEditable: true
  },

  // HIGH HOLY DAYS SECTIONS (4 sections with your provided content)
  {
    key: 'highHolyDaysCalendar',
    title: 'High Holy Days Calendar',
    description: 'Calendar and schedule for High Holy Days services',
    type: 'rich_text' as const,
    category: 'high-holy-days' as const,
    content: `<h2>High Holy Days Calendar for 2025/5786</h2>
<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Erev Rosh Hashanah</strong></td>
    <td style="padding: 8px; border: 1px solid #ddd;">Monday, Sept. 22nd</td>
    <td style="padding: 8px; border: 1px solid #ddd;">7:30 pm</td>
  </tr>
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Rosh Hashanah (1st day)</strong></td>
    <td style="padding: 8px; border: 1px solid #ddd;">Tuesday, Sept. 23rd</td>
    <td style="padding: 8px; border: 1px solid #ddd;">10:00 am</td>
  </tr>
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Kol Nidre</strong></td>
    <td style="padding: 8px; border: 1px solid #ddd;">Wednesday, Oct. 1st</td>
    <td style="padding: 8px; border: 1px solid #ddd;">7:30 pm</td>
  </tr>
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Yom Kippur</strong></td>
    <td style="padding: 8px; border: 1px solid #ddd;">Thursday, Oct. 2nd</td>
    <td style="padding: 8px; border: 1px solid #ddd;">10:00 am</td>
  </tr>
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Ne'ilah</strong></td>
    <td style="padding: 8px; border: 1px solid #ddd;">Thursday, Oct. 2nd</td>
    <td style="padding: 8px; border: 1px solid #ddd;">7:00 pm</td>
  </tr>
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Sukkot</strong></td>
    <td style="padding: 8px; border: 1px solid #ddd;">Monday, Oct. 6th</td>
    <td style="padding: 8px; border: 1px solid #ddd;">7:30 pm</td>
  </tr>
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Simchat Torah</strong></td>
    <td style="padding: 8px; border: 1px solid #ddd;">Tuesday, Oct. 14th</td>
    <td style="padding: 8px; border: 1px solid #ddd;">7:30 pm</td>
  </tr>
</table>`,
    isEditable: true
  },
  {
    key: 'highHolyDaysInfo',
    title: 'High Holy Days Information',
    description: 'Service leaders and break-fast meal information',
    type: 'rich_text' as const,
    category: 'high-holy-days' as const,
    content: `<p><strong>Rosh HaShanah Services will be led by David Matt</strong></p>

<p><strong>Yom Kippur Services will be led by Rabbi Alan Green and David Matt</strong></p>

<p>Please join us for a catered break-fast meal following Ne'ilah service. The meal is free for Dues Paying Members. For all others, there is an additional $12.50 charge.</p>

<p>For planning purposes, Everyone, Members as well as non-member ticket holders must reserve a seat for the Break-Fast meal by email by Wednesday, September 24th: <a href="mailto:bethshalomfairfield@gmail.com">bethshalomfairfield@gmail.com</a></p>`,
    isEditable: true
  },
  {
    key: 'highHolyDaysMembership',
    title: 'High Holy Days Membership',
    description: 'Membership renewal and registration information with PayPal integration',
    type: 'rich_text' as const,
    category: 'services' as const,
    content: `<h2>RENEW or BECOME A MEMBER</h2>
<p><strong>E-MAIL or MAIL YOUR MEMBERSHIP INFORMATION TO:</strong></p>

<p><strong>Address:</strong> Congregation Beth Shalom, c/o 200 W. Washington, Fairfield, Iowa 52556.<br>
<strong>E-Mail:</strong> <a href="mailto:bethshalomfairfield@gmail.com">bethshalomfairfield@gmail.com</a></p>

<p><strong>MEMBERSHIP CATEGORY:</strong><br>
<strong>NAME OF MEMBER(s):</strong><br>
<strong>AMOUNT PAID:</strong><br>
<strong>YOUR MAILING ADDRESS:</strong><br>
<strong>YOUR E-MAIL ADDRESS:</strong></p>

<p><strong>INCLUDE PAYMENT or USE PAYPAL BELOW</strong></p>

<h3>Membership Category</h3>
<div style="margin: 20px 0;">
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd;">Sustaining Membership</td>
      <td style="padding: 10px; border: 1px solid #ddd;">$1000</td>
      <td style="padding: 10px; border: 1px solid #ddd;">[Add to Cart Button]</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd;">Sponsoring Membership</td>
      <td style="padding: 10px; border: 1px solid #ddd;">$500</td>
      <td style="padding: 10px; border: 1px solid #ddd;">[Add to Cart Button]</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd;">Family Membership</td>
      <td style="padding: 10px; border: 1px solid #ddd;">$295</td>
      <td style="padding: 10px; border: 1px solid #ddd;">[Add to Cart Button]</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd;">Single Membership</td>
      <td style="padding: 10px; border: 1px solid #ddd;">$165</td>
      <td style="padding: 10px; border: 1px solid #ddd;">[Add to Cart Button]</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd;">College Faculty, Staff Family</td>
      <td style="padding: 10px; border: 1px solid #ddd;">$145</td>
      <td style="padding: 10px; border: 1px solid #ddd;">[Add to Cart Button]</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd;">College Faculty, Staff Single</td>
      <td style="padding: 10px; border: 1px solid #ddd;">$95</td>
      <td style="padding: 10px; border: 1px solid #ddd;">[Add to Cart Button]</td>
    </tr>
  </table>
</div>`,
    isEditable: true
  },
  {
    key: 'highHolyDaysTickets',
    title: 'High Holy Days Tickets',
    description: 'Non-member ticket information with PayPal integration',
    type: 'rich_text' as const,
    category: 'services' as const,
    content: `<h2>TICKETS for NON-MEMBERS</h2>
<p><strong>E-MAIL or MAIL YOUR HIGH HOLY DAY TICKET INFORMATION TO:</strong></p>

<p><strong>Address:</strong> Congregation Beth Shalom, c/o 200 W. Washington, Fairfield, Iowa 52556.<br>
<strong>E-Mail:</strong> <a href="mailto:bethshalomfairfield@gmail.com">bethshalomfairfield@gmail.com</a></p>

<p><strong>TICKET CATEGORY:</strong><br>
<strong>NAME(S) of Ticket Holders:</strong><br>
<strong>AMOUNT PAID:</strong><br>
<strong>YOUR MAILING ADDRESS:</strong><br>
<strong>YOUR E-MAIL ADDRESS:</strong></p>

<p><strong>INCLUDE PAYMENT or USE PAYPAL BELOW</strong></p>

<h3>Ticket Category</h3>
<div style="margin: 20px 0;">
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd;">Rosh Hashanah and Yom Kippur</td>
      <td style="padding: 10px; border: 1px solid #ddd;">$72</td>
      <td style="padding: 10px; border: 1px solid #ddd;">[Add to Cart Button]</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd;">Rosh Hashanah</td>
      <td style="padding: 10px; border: 1px solid #ddd;">$36</td>
      <td style="padding: 10px; border: 1px solid #ddd;">[Add to Cart Button]</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd;">Yom Kippur</td>
      <td style="padding: 10px; border: 1px solid #ddd;">$42</td>
      <td style="padding: 10px; border: 1px solid #ddd;">[Add to Cart Button]</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd;">College/IA-Rosh Hashanah and Yom Kippur</td>
      <td style="padding: 10px; border: 1px solid #ddd;">$42</td>
      <td style="padding: 10px; border: 1px solid #ddd;">[Add to Cart Button]</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd;">College/IA-Rosh Hashanah</td>
      <td style="padding: 10px; border: 1px solid #ddd;">$19</td>
      <td style="padding: 10px; border: 1px solid #ddd;">[Add to Cart Button]</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd;">College/IA-Yom Kippur</td>
      <td style="padding: 10px; border: 1px solid #ddd;">$25</td>
      <td style="padding: 10px; border: 1px solid #ddd;">[Add to Cart Button]</td>
    </tr>
  </table>
</div>`,
    isEditable: true
  },

  // PASSOVER SECTIONS (3 sections with your provided content)
  {
    key: 'passoverIntro',
    title: 'Passover Seder Information',
    description: 'Main information about the Passover Seder event',
    type: 'rich_text' as const,
    category: 'passover' as const,
    content: `<h2>Congregation Beth Shalom</h2>
<h1 style="color: #F58C28;">PASSOVER SEDER 2024</h1>
<h3>Celebrate the Festival of Freedom<br>
with friends and family at the synagogue</h3>

<h2 style="text-align: center;">Wednesday April 22nd at 7:00 p.m.</h2>

<hr style="margin: 30px 0;">

<p style="text-align: center; font-size: 18px;"><strong>Please reserve your place at the seder table<br>
by Friday April 12th</strong></p>`,
    isEditable: true
  },
  {
    key: 'passoverDetails',
    title: 'Passover Seder Details',
    description: 'Details about the seder leader and pricing',
    type: 'rich_text' as const,
    category: 'passover' as const,
    content: `<h3>Community Seder Monday, April 22nd at 7:00pm</h3>
<p>We're delighted to announce this years seder will be led by <strong>Rabbi Alan Green</strong>.</p>
<p>Sign up below for this live, in-person event. As usual, the synagogue will partially subsidize the meal to keep it affordable. The price per person is $20.</p>

<h3>All Tickets are $20 per person.</h3>
<p>Sign up via Paypal:</p>`,
    isEditable: true
  },
  {
    key: 'passoverReservation',
    title: 'Passover Reservation Information',
    description: 'Contact information and reservation details',
    type: 'rich_text' as const,
    category: 'passover' as const,
    content: `<p>Or mail a check to:<br>
<strong>Congregation Beth Shalom c/o 200 W. Washington Fairfield, Iowa 52556.</strong><br>
Please include a list of names of those who will attend.</p>

<hr style="margin: 30px 0;">

<h3>Questions? Contact Marc & Susan Berkowitz at</h3>
<p><a href="mailto:bethshalomfairfield@gmail.com">bethshalomfairfield@gmail.com</a></p>

<p style="background: #fffbf0; padding: 15px; border-left: 4px solid #F58C28;"><strong>**NOTE: Reservations are required so we can<br>
plan sufficient food and supplies. Seating cannot<br>
be guaranteed for payments after Friday April 12th.</strong></p>

<p style="text-align: center; font-size: 18px;">We hope you will join us.</p>

<hr style="margin: 40px 0;">

<div style="text-align: center; background: #f8f8f8; padding: 20px; border-radius: 8px;">
<h4>Congregation Beth Shalom</h4>
<p><strong>Location:</strong> 308 South B Street<br>
<strong>Mailing address:</strong> c/o 200 West Washington<br>
Fairfield, Iowa 52556<br>
<a href="https://bethshalomfairfield.com">https://bethshalomfairfield.com</a><br>
<a href="mailto:bethshalomfairfield@gmail.com">bethshalomfairfield@gmail.com</a></p>
</div>`,
    isEditable: true
  }
];

export async function importAllContent(userId: string = 'system'): Promise<void> {
  console.log('🚀 Starting comprehensive content import...');
  console.log(`📊 Total sections to create: ${allContentSections.length}`);
  
  let successCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  try {
    for (const sectionData of allContentSections) {
      try {
        const contentSection: Omit<ContentSection, 'createdAt' | 'updatedAt'> = {
          id: `${sectionData.category}-${sectionData.key}`,
          ...sectionData
        };
        
        await createContentSection(contentSection, userId);
        console.log(`✅ Created: ${sectionData.title} (${sectionData.category})`);
        successCount++;
      } catch (error) {
        const errorMsg = `❌ Failed to create ${sectionData.title}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error(errorMsg);
        errors.push(errorMsg);
        errorCount++;
      }
    }
    
    console.log('\n📋 Import Summary:');
    console.log(`✅ Successfully created: ${successCount} sections`);
    console.log(`❌ Failed: ${errorCount} sections`);
    
    if (errors.length > 0) {
      console.log('\n🚨 Errors:');
      errors.forEach(error => console.log(error));
    }
    
    console.log('\n🎉 Content import completed!');
    console.log('\n📂 Created sections by category:');
    console.log('   - History: 5 sections');
    console.log('   - Services (Shabbat): 3 sections');
    console.log('   - Services (High Holy Days): 4 sections');
    console.log('   - Services (Passover): 3 sections');
    console.log(`   - Total: ${successCount} sections`);
    
  } catch (error) {
    console.error('💥 Fatal error during import:', error);
    throw error;
  }
}

// This allows the script to be run directly
if (require.main === module) {
  importAllContent().catch(console.error);
}