import { getMultipleContentByKeys } from '@/app/utils/firebase-operations';
import { formatContentAsHtml } from '@/app/utils';

export const metadata = {
  title: 'History - Congregation Beth Shalom',
  description: 'The history of the Jewish Community in Fairfield, Iowa and Congregation Beth Shalom.',
};

export default async function HistoryPage() {
  // Fetch content server-side with fallbacks
  const content = await getMultipleContentByKeys([
    'historyIntro',
    'historyEarlyDays', 
    'historyFoundation',
    'historyBuilding',
    'historyGrowth'
  ]);
  
  // Set fallbacks for any missing content
  const contentWithFallbacks = {
    historyIntro: content.historyIntro || `<p>In 2006, Margo Baum collected reminiscences of a number of members of Congregation Beth Shalom who have been here since the "early days." Collectively they make up, if not a history, at least an impression of what the Jewish community and Congregation Beth Shalom were like from the mid-1970s to 2007.</p>`,
    historyEarlyDays: content.historyEarlyDays || `<p>"A group of ten or twelve of us went to Rosh Hashanah services in Ottumwa. None of us had been in Iowa before. These older people — in their 50's and 60's — were so excited to see a group of young people. They fought over who would take us for Rosh Hashanah and break fast for Yom Kippur," reminisces June Schindler of her first touch of Judaism in Iowa in 1974.</p>

<p>According to legend, there were only 1½ Jewish families in Fairfield at this time — the Silverman's and one half of another Jewish couple. I believe it may have been Paula Rackoff and I think she may have run for city or county office. Parsons College had now become Maharishi International University (MIU) where a group of Jewish meditating faculty and students became the foundation for the Fairfield Jewish congregation — Congregation Beth Shalom, or, "House of Peace." But, where was the "House"?</p>

<p>Like their tribal ancestors, during the 1970's the Fairfield congregation was a nomadic group on the MIU campus (now Maharishi University of Management), going from Barhydt Chapel, to "pod" basements (those curious little odd-shaped campus residence buildings, subsequently destroyed), to frat houses, to Howard Dinning Hall and to the Student Union. They also congregated in the homes of Artie and Pam Robinson, and Jeff and Carin Cohen.</p>`,
    historyFoundation: content.historyFoundation || `<p>Michael Mescon remembers attending a service in the balcony of Barhydt Chapel with about 15 others in 1974 when he was a student. He says they gathered there because "That's where the ark was." It was "A little wooden portable ark made out of plywood," remembers Bob Rabinoff who became the congregation's first president. June Schindler recalls that "The handles were broken on the Torah and had to be repaired. We worried about the type of glue that was used." Apparently, Parsons, which was Presbyterian in affiliation but had a branch of the Hillel Foundation, had left a Torah with the building; two other Torahs were donated to the group at a later time.</p>

<p>June recalls Chucky Blitz leading services in Barhydt. "And at the end of one service, David Sands ran in to have a baby naming," she states, referring to the newborn, Eve. There were a variety of service leaders including Chucky, Bob Rabinoff, Jan Kirschner and Artie Robinson. Bob says, "Nobody knew how to run services. It was the land of the blind." However, there were many contributors to the cause of leading the blind, including Phil Fox.</p>

<p>"Phil came from Poland to the United States in 1936. He taught us a lot, just traditional Jewish customs — how to daven, how to pray. We had muddled our way through and he was a big positive influence. He showed us the way a real synagogue functioned — leading services correctly. He taught us what portions to read at Yom Kippur and how to do "tashlich."</p>

<p>Bob also remembers, "Manis Friedman, a Chabad rabbi in Minneapolis who came down and gave lectures on Judaism. He showed me how to lay tefillin." A meditating cantorial student became our cantor and taught Bob the Torah trope.</p>

<p>Finally, in the early 1980's during a service in the "pod," David Matt felt the desire to keep in the tradition of the long line of rabbis in his family; he offered to lead services. "I saw that I was really the only one in the congregation who had been trained to lead High Holy Day services so I volunteered." He started out helping Artie Robinson and by reading portions of the Torah. Within a year or two he became the synagogue's official religious leader.</p>`,
    historyBuilding: content.historyBuilding || `<p>As more and more Jewish families moved to Fairfield, a bigger space was needed to hold the congregation — especially for High Holy Days. According to Chaya Green, formerly Katy Rabinoff, "space on campus became crowded and MIU was shifting us from place to place." She felt that we should find our own building.</p>

<p>Chaya says, "I kept my eyes open for a golden opportunity. Then Jane and Barry Pitt's son, Jesse, and some other young people had upcoming bar mitzvahs. I knew this could galvanize people and I asked to call a meeting at their house. This became the foundation for getting our own synagogue. Bill Pollak showed up."</p>

<p>In 1984 Bill, who later became the congregation's second president, became aware that a church on B Street was for sale. He says, "The church was a glove factory that the Baptists had bought. It had a baptismal in the back of the sanctuary — a big tub, that was pulled out when it was sold." A decision was made to buy the building, even if the old glove factory did not fit like a — well, like a glove.</p>

<p>At the time of purchase, the sanctuary faced west — the wrong direction for traditional Jewish prayer. "Initially there was a door directly into the sanctuary from the front hall — where the ark is now. We wanted to have the sanctuary more quiet and private and we also wanted the ark to be in the right position facing east, so that change was made fairly early," says Julie Blum. She remembers that, "Handy members of the synagogue did a lot of work — especially Bill Pollak and Steve Blum. There was a small group of dedicated men who helped with whatever needed to be done, including Nathan Zenack, Bob Rabinoff and Brian Teitzman."</p>`,
    historyGrowth: content.historyGrowth || `<p>Monthly funds for purchasing the building came from membership dues and donations. Julie says there was a good response from the community to have our own building. Early and generous financial supporters included: Joseph and Ann Berman, Warren and Harriet Berman, Richard and Judy Eisner, Bill and Leslie Elkus, Steven and Gillian Foster, Bernard and Lillian Freeman, Marc and Marci Freeman, Jay Glazer, Joel and Joy Hirshberg, Michael and Miriam Mescon, Barry and Jane Pitt, Irving and Sarah Pitt, Bill and Brenda Pollak, Fred and Debra Poneman, Bob and Katy Rabinoff, Jonathan Sabin, Fred and Janet Swartz, Phillip and Dorothy Swartz, David A. Tapper, Brian and Bernadette Teitzman, David Vatz, and Nathan and Marie Zenack.</p>

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

<p><strong>Gai Gezunthayt.</strong></p>`
  };

  return (
    <div className="min-h-screen pt-32 pb-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold" style={{color: '#F58C28'}}>
            History
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-4">
            History of the Jewish Community in Fairfield, Iowa
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div 
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatContentAsHtml(contentWithFallbacks.historyIntro as string) }}
          />
        </div>

        {/* Early Days */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Early Days</h2>
          <div 
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ __html: formatContentAsHtml(contentWithFallbacks.historyEarlyDays as string) }}
          />
        </div>

        {/* Foundation */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Foundation and Leadership</h2>
          <div 
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ __html: formatContentAsHtml(contentWithFallbacks.historyFoundation as string) }}
          />
        </div>

        {/* Building */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Finding Our Home</h2>
          <div 
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ __html: formatContentAsHtml(contentWithFallbacks.historyBuilding as string) }}
          />
        </div>

        {/* Growth */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Growth and Community</h2>
          <div 
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ __html: formatContentAsHtml(contentWithFallbacks.historyGrowth as string) }}
          />
        </div>
      </div>
    </div>
  );
}