export const metadata = {
  title: 'All About Judaism - Congregation Beth Shalom',
  description: 'Learn about Judaism, traditions, customs, and practices at Congregation Beth Shalom.',
};

export default function JudaismPage() {
  return (
    <div className="min-h-screen pt-32 pb-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold" style={{color: '#F58C28'}}>
            ALL ABOUT JUDAISM
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-4">
            Discover the beauty and wisdom of Jewish traditions, teachings, and practices
          </p>
        </div>

        {/* Who is a Jew Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Who is a Jew?</h2>
          <p className="text-gray-700 mb-4">
            For more information, visit: <a href="http://www.jewishvirtuallibrary.org/jsource/Judaism/whojew1.html" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Jewish Virtual Library</a>
          </p>
        </div>

        {/* Siddur Audio Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Siddur Audio – Free Learning Resource</h2>
          <p className="text-gray-700 mb-4">
            Free audio clips to learn Beth Shalom Services at <a href="http://www.sidduraudio.com/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">SiddurAudio.com</a>
          </p>
          <p className="text-gray-700 mb-4">
            Hebrew Prayer, Shabbat services, Jewish weekday, and Passover Seder – Download Sound Clips Online
          </p>
          <p className="text-gray-700 mb-4">
            Beth Shalom's president, Mark Berkowitz, reports, "This is an unbelievable free resource. Learn any and all synagogue services online free. From the same Siddur Sim Shalom we use at Beth Shalom. They have a sister site where you can learn any haftorah the same way. The cantor has a sweet voice that's reminiscent of our very own Rabbi Alan Green; delightful to listen to."
          </p>
          <p className="text-gray-700">
            "Even if your Hebrew reading skills are low, you can still learn by singing along with the familiar melodies. It's actually a great way to improve your Hebrew reading skills. No more excuses for phumfering along during services."
          </p>
        </div>

        {/* Shabbat Candles Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Do you light Shabbat candles?</h2>
          <div className="text-gray-700 space-y-4">
            <p>Shabbos is the Soul of the world.</p>
            <p>Shabbos gives us the power to elevate time to holiness.</p>
            <p>Six days of the week we work to separate the holiness out of the weekdays, doing good, staying away from evil, sifting the Holy Sparks that were hidden in the week, then everything is elevated on Shabbos.</p>
            <p>Shabbos is unchanging, eternal. The weekdays are constantly changing, up and down, up and down, But on Shabbos, everything is complete.</p>
            <p className="italic">
              Go to FRIDAY LIGHT at <a href="http://fridaylight.org/page/new-index.php" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">fridaylight.org</a> for a beautiful website presentation on lighting Shabbos candles.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg italic">
              <p>Fire touches wick.</p>
              <p>Flame reaches upward.</p>
              <p>Another home is bathed in peace and holiness, in warmth and unity.</p>
            </div>
            <p>Shabbat candles illuminate the world with spirituality. Would you like to light Shabbos candles? Do you know a Jewish woman or girl who might? Get your free Shabbos kit!</p>
            <p>A Jewish woman has invited the Sabbath Queen into her home. The darkness of the day's problems recedes, exiled by the peaceful glow of the Shabbos candles. It is truly a gift from heaven.</p>
            <p>All that is good, all that is holy is symbolized – indeed realized in the flickering light of the Sabbath candles.</p>
            <p>Two millennia ago, the Holy Zohar declared that a woman kindling her Sabbath candles with joy in her heart brings peace on earth, long life to her loved ones, and is blessed with children who illuminate our world with Torah.</p>
            <p>Lighting Shabbos candles 18 minutes before sunset on Friday night strengthens one's faith and inspires a heightened awareness of the G-dliness that permeates our world and makes all good things possible.</p>
          </div>
        </div>

        {/* Tablet Magazine Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tablet Magazine</h2>
          <p className="text-gray-700 mb-4">
            Do you know of the online Tablet Magazine? It's a free, online digest of articles (and <a href="http://www.tabletmag.com/podcasts/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">podcasts</a>) on Jewish culture, arts and literature.
          </p>
          <p className="text-gray-700">
            Check out: Tu B'Shevat FAQ. Everything you ever wanted to know about the arboreal holiday.
          </p>
        </div>

        {/* Tu B'Shevat Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tu B'Shevat</h2>
          <div className="text-gray-700 space-y-4">
            <p><strong>Significance:</strong> The "new year" for calculating the age of trees</p>
            <p><strong>Length:</strong> 1 day</p>
            <p><strong>Customs:</strong> eating fruit; planting trees (or paying for planting them)</p>
            <p><strong>Jewish Year 5770:</strong> sunset January 29, 2010 – nightfall January 30, 2010</p>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="italic">"When you come to the land and you plant any tree, you shall treat its fruit as forbidden; for three years it will be forbidden and not eaten. In the fourth year, all of its fruit shall be sanctified to praise the L-RD. In the fifth year, you may eat its fruit." -Leviticus 19:23-25</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="italic">"There are four new years… the first of Shevat is the new year for trees according to the ruling of Beit Shammai; Beit Hillel, however, places it on the fifteenth of that month." –Mishnah Rosh Hashanah 1:1</p>
            </div>
            
            <p>Tu B'Shevat, the 15th day of the Jewish month of Shevat, is a holiday also known as the New Year for Trees. The word "Tu" is not really a word; it is the number 15 in Hebrew, as if you were to call the Fourth of July "Iv July" (IV being 4 in Roman numerals).</p>
            
            <p>As I mentioned in Rosh Hashanah, Judaism has several different "new years." This is not as strange a concept as it sounds at first blush; in America, we have the calendar year (January-December), the school year (September-June), and many businesses have fiscal years. It's basically the same idea with the various Jewish new years.</p>
            
            <p>Tu B'Shevat is the new year for the purpose of calculating the age of trees for tithing. See Lev. 19:23-25, which states that fruit from trees may not be eaten during the first three years; the fourth year's fruit is for G-d, and after that, you can eat the fruit. Each tree is considered to have aged one year as of Tu B'Shevat, so if you planted a tree on Shevat 14, it begins its second year the next day, but if you plant a tree two days later, on Shevat 16, it does not reach its second year until the next Tu B'Shevat.</p>
            
            <p>Tu B'Shevat is not mentioned in the Torah. I have found only one reference to it in the Mishnah, and the only thing said there is that it is the new year for trees, and there is a dispute as to the proper date for the holiday (Beit Shammai said the proper day was the first of Shevat; Beit Hillel said the proper day was the 15th of Shevat. As usual, we follow Beit Hillel.</p>
            
            <p>There are few customs or observances related to this holiday. One custom is to eat a new fruit on this day. Some people plant trees on this day. A lot of Jewish children go around collecting money for trees for Israel at this time of year. That's about all there is to it on a very basic level.</p>
          </div>
        </div>

        {/* Reconstructionist Judaism Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Is Reconstructionist Judaism For You?</h2>
          <div className="text-gray-700 space-y-4">
            <p>"Torah" means "teaching." In Jewish tradition, talmud Torah, the study of Torah, is a life-long obligation and opportunity. Reconstructionists are committed to a serious engagement with the texts and teachings, as well as the art, literature and music of tradition. But we are not passive recipients; we are instead challenged to enter the conversation of the generations and to hear voices other than our own, but to add our own voices as well.</p>
            
            <p>Reconstructionist Judaism is respectful of traditional Jewish observances but also open to new interpretations and forms of religious expression. As Rabbi Mordecai M. Kaplan (1881-1983), the founder of Reconstructionism, taught, tradition has "a vote, but not a veto." Reconstructionists share a commitment to making Judaism their own by finding in it joy, meaning, and ideas they can believe.</p>
            
            <p>Unlike Orthodox and Conservative Judaism, Reconstructionism does not view inherited Jewish law (halakhah) as binding. We continue to turn to Jewish law for guidance, if not always for governance. We recognize that in the contemporary world, individuals and communities make their own choices with regard to religious practice and ritual observance.</p>
            
            <p>But where Reform Judaism emphasizes individual autonomy, Reconstructionism emphasizes the importance of religious community in shaping individual patterns of observance. Belonging to a community leads us to take the patterns of observance within that community seriously; our choices do not exist independently, but are made in response to our community as part of our participating in it. Reconstructionism thus retains a warmly traditional (and fully egalitarian) approach to Jewish religious practice.</p>
            
            <h3 className="text-lg font-semibold text-gray-900">Spiritual Seeking</h3>
            <p>Reconstructionists hold diverse ideas about God, but we share an emphasis on Godliness –those hopes, beliefs, and values within us that impel us to work for a better world, that give us strength and solace in times of need, that challenge us to grow, and that deepen our joy in moments of celebration.</p>
            
            <p>Reconstructionist prayerbooks speak of God beyond the gender concepts of male/female, and beyond the traditional metaphor of "king of the universe." For example, in our prayerbooks God is addressed as, among other things, "The Healer," "The Teacher," "The Comforter," and "The Presence." We are engaged in the spiritual adventure of discovering the many attributes of the one God.</p>
            
            <h3 className="text-lg font-semibold text-gray-900">Ethics and Values</h3>
            <p>Reconstructionist communities emphasize acts of social justice alongside prayer and study as an essential part of their spiritual practice. Reconstructionist Judaism affirms that religion can and must be a powerful force for promoting communal discussion about ethics and values. The Torah tradition itself is a deep and wide resource for this project. Yet we know that generations of Jews have sharpened and distilled the ethical insights of Judaism as a result of their encounter with other cultures and traditions, and so it is in our time.</p>
          </div>
        </div>

        {/* Yahrzeit Candles Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Yahrzeit Candle / Yizkor Service</h2>
          <div className="text-gray-700 space-y-4">
            <p className="italic">"The soul of man is the light of God."</p>
            
            <p>There are 4 times a year when Jews light a special candle, called a Yahrzeit Candle, in memory of loved ones who have died.</p>
            
            <p>Yizkor is a memorial service which is recited on Yom Kippur as well as the last days of Passover, Shavuot, and Sukkot. Yizkor, which is the Hebrew word for "remember", asks G-d to remember those we mourn and to grant them proper rest.</p>
            
            <p><strong>A Yahrzeit Candle is lit at sundown on…</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li>The first night of Yom Kippur</li>
              <li>The night of Shemini Atzeret (the 8th night of Sukkot)</li>
              <li>The second night of Shavuot</li>
              <li>The last night of Passover</li>
            </ul>
            <p>The Yizkor service takes place the following day.</p>
            
            <p>Jews commemorate the anniversary of the death of loved ones by lighting a small candles, called a yahrzeit candle, which burns throughout the 24-hour day of the anniversary of death. The flame of the candle is a potent symbol of the flame of life that once burned brightly and illumined the lives of loved ones who mourn the loss. The date of the anniversary of the death of a loved one is determined by the Hebrew calendar.</p>
            
            <p>Lighting a yahrzeit candle in memory of a loved one is a lovely minhag (custom). While it is not required by halakhah (Jewish law), it is so deeply ingrained in Jewish life, it is difficult to imagine not doing so, and doing so honors the memory of those no longer with us in life.</p>
            
            <p>There are no prescribed prayers to recite when one lights a yahrzeit candle.</p>
            
            <p className="italic">Recite whatever prayer is in your heart; the prayers of the heart are especially precious to God.</p>
          </div>
        </div>

        {/* Hebrew School Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">"WHY DO I HAVE TO GO TO HEBREW SCHOOL?" (What does Being Jewish mean?")</h2>
          <div className="text-gray-700 space-y-4">
            <p>Because we love you and want you to know as much about being Jewish as you possibly can.</p>
            <p>Because we parents often don't know as much as we possibly could about being Jewish and can't give you all the right answers.</p>
            <p>Because at Hebrew School you get to learn and socialize with other Jewish children, just like yourself (who may sometimes wonder why they have to go, too.)</p>
            <p>Because one of the most important things the Torah expects of parents is that they teach their children Torah – and if we are unable to do that, we are obligated to find someone who can do it for us.</p>
            <p>Because Judaism is a rich and full heritage older than 5000 years, with lots to learn about, enjoy, and appreciate, and Hebrew School is a great place to be introduced to it.</p>
            <p>Because if you didn't go and later found out all you had missed, you'd probably be mad at your parents.</p>
            <p>Because Judaism is precious and beautiful and important and your parents want you to share in it and be connected to it.</p>
            <p>Because whatever career or role in life you pursue the knowledge and information you gain in Hebrew School will enrich you in ways you cannot even imagine.</p>
            <p>Because Judaism is more than just a religion – it is a way of life.</p>
            <p>Because all of Judaism is based on scholarship and study. If we spent our whole lives studying Torah, we still wouldn't know everything there is to know about living our lives the way God wants us to live them.</p>
            <p>Because at Hebrew School you learn to read Hebrew so that you can understand what is going on at services.</p>
            <p>Because at Hebrew School you learn all you need to know to fully participate in your bar or bat mitzvah ceremony.</p>
            <p>Because to be a good Jew you must first be a knowledgeable Jew.</p>
            <p>Because sometimes we parents know what is really best for you, and you just have to trust us (in the same way that we all have to trust that God knows what is best for us, even when we don't understand why).</p>
            <p>Because sometimes, as children, you don't yet have the ability to appreciate really good things and will only realize how good those things truly are when you get older.</p>
            <p>Because Hebrew School is just as important, and in some ways may be more important, than public school.</p>
            <p>Because you are so fortunate that there is the State of Israel in your lifetime, and going to Hebrew School is a great way to strengthen your connection to Israel and to the Israelis – by learning the history, songs, and stories of our homeland and its people.</p>
            <p>Because, unlike those Jewish children who are not allowed to learn and practice Judaism in some countries, you are lucky enough to live in freedom with the right to study your religion openly.</p>
            <p>Because Judaism has survived all kinds of persecution and disasters throughout the ages, but it cannot survive indifference and neglect by its own people.</p>
            <p>Because the only way for you to continue the unbroken chain of Judaism is to study it, know it, and pass it along to your children. You are a precious link in this chain, which stretches back through generations, and while you may add to it, you should not break it.</p>
            <p className="font-semibold">That way, someday years from now when your children ask you, "Why do I have to go to Hebrew School?" you can smile at them very knowingly and answer, "Because."</p>
          </div>
        </div>
      </div>
    </div>
  );
}