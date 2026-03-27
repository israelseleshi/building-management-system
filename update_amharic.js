const fs = require('fs');

const replacement = `
    title1: "የንብረት አስተዳደር",
    title2: "በአዲስ መልክ!",
    subtitle: "የተለያዩ አፕሊኬሽኖችን እና ፋይሎችን መጠቀም ያቁሙ። የኛ ሲስተም ሁሉንም ነገር በአንድ ላይ በማገናኘት — ",
    subtitleHighlight: "ተከራዮች፣ ፋይናንስ፣ ጥገና እና የዕለት ተዕለት ግንኙነቶችን",
    subtitleEnd: " — በአንድ ዘመናዊ መድረክ ያቀርባል።",
    cta1: "በነፃ ይጀምሩ",
    cta2: "አገልግሎቶችን ይመልከቱ",
    feature1: "የክፍያ ካርድ አያስፈልግም",
    feature2: "የ 14 ቀናት ነፃ ሙከራ",
    feature3: "በማንኛውም ጊዜ ማቋረጥ ይችላሉ",
    featuresTitle: "አገልግሎቶች",
    featuresSubtitle: "ለስራዎ እድገት የሚያስፈልግዎ ነገሮች በሙሉ",
    featuresDesc: "ለዘመናዊ የንብረት አስተዳደር የተዘጋጀ የተሟላ ሲስተም።",
    dashboardTitle: "ማዕከላዊ ዳሽቦርድ",
    dashboardSubtitle: "ሁሉንም ነገር ከአንድ ቦታ ሆነው ያስተዳድሩ",
    dashboardDesc: "ስለንብረትዎ የተሟላ መረጃ ያግኙ። ህንፃዎችን፣ ቤቶችን፣ ተከራዮችን እና ፋይናንስን ለኢትዮጵያውያን የንብረት አስተዳዳሪዎች ተብሎ በተሰራ ቀላል ዳሽቦርድ ይከታተሉ።",
    dashboardTags: ['በቅጽበት የሚታደስ መረጃ', 'እንደፍላጎትዎ የሚዘጋጅ ሪፖርት', 'ለሞባይል አመቺ'],
    dashboardBadge: "በብዛት ጥቅም ላይ የዋለ",
    propertyTitle: "የበርካታ ንብረቶች አስተዳደር",
    propertySubtitle: "ሁሉንም ህንፃዎችዎን ይቆጣጠሩ",
    propertyDesc: "ከአንድ ሲስተም ላይ ሆነው በርካታ ንብረቶችን ያስተዳድሩ። 2 ወይም 200 ህንፃዎች ቢኖሩዎትም ሲስተማችን አብሮዎት ያድጋል።",
    propertyTags: ['ያልተገደቡ ህንፃዎች', 'አጠቃላይ እይታ', 'የጅምላ ትዕዛዞች'],
    messagingTitle: "ውስጣዊ የመልዕክት ልውውጥ",
    messagingSubtitle: "በፍጥነት ይገናኙ",
    messagingDesc: "በሲስተሙ የውስጥ መልዕክት አማካኝነት ከተከራዮች እና ሰራተኞች ጋር ይገናኙ። አዳዲስ መረጃዎችን ያካፍሉ፣ ችግሮችን ይፍቱ፣ የግል ስልክ ቁጥር ሳይለዋወጡ ግንኙነትዎን ያጠናክሩ።",
    messagingTags: ['የቀጥታ ልውውጥ', 'ፋይሎችን መላክ', 'የተነበበ መሆኑን ማወቅ'],
    documentsTitle: "ዲጂታል ሰነዶች",
    documentsSubtitle: "ወረቀት አልባ አሰራር",
    documentsDesc: "የኪራይ ውሎችን፣ ኮንትራቶችን እና ቁልፍ ሰነዶችን በዲጂታል መንገድ ያስቀምጡ። ስምምነቶችን በኤሌክትሮኒክ ፊርማ ያፅድቁ፣ ወረቀት ጠፋብኝ ብለው አይጨነቁ።",
    documentsTags: ['የዲጂታል ፊርማ', 'በደመና ላይ ማከማቸት', 'የጊዜ ማብቂያ ማሳወቂያዎች'],
    attendanceTitle: "የመገኘት ክትትል",
    attendanceSubtitle: "ሰራተኞችን እና የጥበቃ አባላትን ይቆጣጠሩ",
    attendanceDesc: "የሰራተኞችን የስራ ሰዓት፣ የጥበቃ ፈረቃዎችን እና የጥገና ሰራተኞችን መርሃግብር ይከታተሉ። የደሞዝ ሪፖርቶችን በማውጣት በሁሉም ንብረቶችዎ በቂ ሰራተኛ መኖሩን ያረጋግጡ።",
    attendanceTags: ['የፈረቃ መርሃግብር', 'ከደሞዝ ጋር የተሳሰረ', 'የጂፒኤስ ልየታ (GPS)'],
    notificationsTitle: "ብልጥ ማሳወቂያዎች",
    notificationsSubtitle: "ሁልጊዜም ወቅታዊ መረጃ ያግኙ",
    notificationsDesc: "ለኪራይ ክፍያዎች፣ የውል እድሳት፣ የጥገና ጥያቄዎች እና ሌሎችም አውቶማቲክ ማሳወቂያዎችን ይቀበሉ። ምንም አይነት ወሳኝ መረጃ አያምልጥዎ።",
    notificationsTags: ['የክፍያ ማሳወቂያዎች', 'የእድሳት ማስታወሻዎች', 'እንደፍላጎትዎ የሚዘጋጁ'],
    ownerTitle: "ለንብረት ባለቤቶች",
    ownerHeadline: "የኢንቨስትመንት ገቢዎን ያሳድጉ",
    ownerDesc: "በተለያዩ ፋይሎችና አፕሊኬሽኖች መጨነቅዎን ያቁሙ። በየሳምንቱ በርካታ ሰዓታትን በሚያቆጥብ አውቶማቲክ አሰራር ስለንብረቶችዎ የተሟላ መረጃ እና ቁጥጥር ይኑርዎት።",
    ownerCta: "ማስተዳደር ይጀምሩ",
    analyticsTitle: "ወቅታዊ ትንታኔዎች",
    analyticsDesc: "ቤቶቹ የተከራዩበትን መጠን፣ ገቢን እና ወጪን በዘመናዊ ዳሽቦርዶች ይከታተሉ",
    rentTitle: "አውቶማቲክ የኪራይ ስብሰባ",
    rentDesc: "በአውቶማቲክ ማስታወሻዎች ክፍያዎችን በጊዜ ይሰብስቡ",
    tenantTitle: "የተከራይ አስተዳደር",
    tenantDesc: "ሁሉንም ተከራዮች ከአንድ ዳሽቦርድ ላይ ሆነው ይምረጡ፣ ይመዝግቡ እና ያስተዳድሩ",
    legalTitle: "ህጋዊ ተገዢነት",
    legalDesc: "ሰነዶችን በራስሰር በማመንጨት ህጋዊ የሆኑ አሰራሮችን ይከተሉ",
    checklist1: "አውቶማቲክ የኪራይ ስብሰባ ከፈጣን ማሳወቂያዎች ጋር",
    checklist2: "ወቅታዊ የፋይናንስ ሪፖርቶች እና ትንታኔዎች",
    checklist3: "በሁሉም ንብረቶች ላይ ያሉ የተከራዩ እና ክፍት ቤቶች ክትትል",
    checklist4: "ህጋዊ ተገዢነት እና የሰነድ አስተዳደር",
    checklist5: "የተከራይ ታሪክን እና ማንነትን ማጣራት",
    checklist6: "የጥገና ጥያቄዎችን የመከታተያ ስርዓት",
`;

let content = fs.readFileSync('src/components/home/designs/Design1Minimal.tsx', 'utf8');

const regex = /am:\s*\{([\s\S]*?)\n  \},?\n\}/;
const match = content.match(regex);
if (match) {
    const updated = content.replace(regex, "am: {\n" + replacement + "  },\n}");
    fs.writeFileSync('src/components/home/designs/Design1Minimal.tsx', updated, 'utf8');
    console.log("Updated successfully");
} else {
    console.log("Failed to match am: block");
}
