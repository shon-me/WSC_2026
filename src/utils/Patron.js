import { placeholderImage, placeholderPortrait } from '../utils/PlaceHolder'

// Everything on the patron page is read from this file.
//
// Facts (office, committee roles, education, career) come from public profiles of the Senator
// (parliamentary records and news coverage) and from the cup's own forms. Please have the patron's
// office confirm them before launch.
//
// Anything with `sample: true` is test content (generated images, a sample video). Replace it with
// official photos and videos, then delete the flag and the "Sample" chip disappears.
//
// The "goals" below describe priorities he has spoken and worked for in public. The patron's office
// should confirm them or rewrite them in his own words.

const SAMPLE_VIDEO = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'

export const patron = {
  honorific: 'Wakili',
  name: 'Hillary Sigei',
  title: 'Senator for Bomet County',
  role: 'Patron, Wakili Sigei Cup',
  tagline: 'Better lives, together',
  portrait: { src: placeholderPortrait(), alt: 'Portrait of Wakili Hillary Sigei', sample: true },

  facts: [
    { icon: 'mdi-bank-outline', label: 'Office', value: 'Senator, Bomet County' },
    { icon: 'mdi-scale-balance', label: 'Senate committee', value: 'Chair, Justice, Legal Affairs and Human Rights' },
    { icon: 'mdi-gavel', label: 'Profession', value: 'Advocate of the High Court of Kenya' },
    { icon: 'mdi-hand-heart-outline', label: 'Foundation', value: 'Hillary Sigei Foundation' },
  ],

  bio: [
    'Hillary Sigei is an advocate of the High Court of Kenya and the Senator for Bomet County, elected in August 2022. He is Managing Partner of SMS Advocates LLP and chairs the Senate Committee on Justice, Legal Affairs and Human Rights.',
    'He studied law at the University of Nairobi and the Kenya School of Law, started in private practice as an associate advocate in 2009, and went on to lead his own law firms.',
    'As patron of the Wakili Sigei Cup, he backs a tournament that takes football from village pitches all the way to the county finals, under the line "Where dreams meet opportunities".',
  ],

  career: [
    { when: '2022 to date', title: 'Senator, Bomet County', place: 'Senate of Kenya' },
    { when: '2013 to date', title: 'Managing Partner', place: 'SMS Advocates LLP' },
    { when: '2012 to 2013', title: 'Managing Partner', place: 'Sigei & Associates Advocates' },
    { when: '2009 to 2011', title: 'Associate Advocate', place: 'Katwa & Kemboy Advocates' },
  ],

  education: [
    { when: '2012 to 2014', title: 'Master of Laws (LLM)', place: 'University of Nairobi' },
    { when: '2006', title: 'Post Graduate Diploma in Law', place: 'Kenya School of Law' },
    { when: '2001 to 2005', title: 'Bachelor of Laws (LLB)', place: 'University of Nairobi' },
    { when: '1996 to 1999', title: 'Secondary school', place: 'Tenwek High School' },
    { when: '1987 to 1995', title: 'Primary school', place: 'Ndamichonik Primary School' },
  ],

  achievements: [
    {
      id: 1,
      year: '2022',
      category: 'Public service',
      title: 'Elected Senator for Bomet County',
      text: 'Took office on 16 August 2022 as the county’s representative in the Senate.',
      image: placeholderImage(31, 1000, 600),
      sample: true,
    },
    {
      id: 2,
      year: '2022',
      category: 'Law',
      title: 'Chair of the Senate justice committee',
      text: 'Appointed in October 2022 to chair the Committee on Justice, Legal Affairs and Human Rights. He also sits on the Senate Business, Liaison, and Procedure and Rules committees.',
      image: placeholderImage(32, 1000, 600),
      sample: true,
    },
    {
      id: 3,
      year: '2023',
      category: 'Law',
      title: 'Sponsored the Tea (Amendment) Bill',
      text: 'Sponsored the bill, which was listed as Senate Bill No. 1 of 2023.',
      image: placeholderImage(33, 1000, 600),
      sample: true,
    },
    {
      id: 4,
      year: 'Ongoing',
      category: 'Community',
      title: 'Patron of the Wakili Sigei Cup',
      text: 'Backs a football tournament that runs from village level to the county finals, now in its third edition.',
      image: placeholderImage(34, 1000, 600),
      sample: true,
    },
    {
      id: 5,
      year: 'Ongoing',
      category: 'Community',
      title: 'Hillary Sigei Foundation',
      text: 'The foundation works under the line "Better lives, together" and is part of the cup’s official branding.',
      image: placeholderImage(35, 1000, 600),
      sample: true,
    },
    {
      id: 6,
      year: '2013',
      category: 'Law',
      title: 'Leads SMS Advocates LLP',
      text: 'Has been Managing Partner of the law firm since 2013, after starting his own practice in 2012.',
      image: placeholderImage(36, 1000, 600),
      sample: true,
    },
    {
      id: 7,
      year: '2014',
      category: 'Education',
      title: 'Master of Laws, University of Nairobi',
      text: 'Completed an LLM in 2014, following a law degree from the same university and the Kenya School of Law diploma.',
      image: placeholderImage(37, 1000, 600),
      sample: true,
    },
  ],

  goals: [
    {
      icon: 'mdi-scale-balance',
      title: 'Justice and the rule of law',
      text: 'As an advocate and as chair of the Senate’s justice and legal affairs committee, he keeps law and human rights at the centre of his work.',
      proof: 'Chair, Senate Committee on Justice, Legal Affairs and Human Rights',
    },
    {
      icon: 'mdi-bank-outline',
      title: 'Public money that reaches people',
      text: 'He speaks publicly for county funds to be used well, and for better systems and service delivery in Bomet.',
      proof: 'Public statements on accountability for county funds',
    },
    {
      icon: 'mdi-home-heart',
      title: 'Safe homes and strong families',
      text: 'He has called on government, schools, faith groups and communities to work together against gender-based violence in the county.',
      proof: 'Public call for action on gender-based violence',
    },
    {
      icon: 'mdi-soccer',
      title: 'Opportunity for young people',
      text: 'The Wakili Sigei Cup gives young players a clear path from village pitches to the county finals.',
      proof: 'Patron, Wakili Sigei Cup',
    },
  ],

  videos: [
    { id: 1, title: 'Cup highlights', text: 'The best moments from the latest round.', duration: 24, src: SAMPLE_VIDEO, poster: placeholderImage(41, 800, 450), sample: true },
    { id: 2, title: 'A message to the teams', text: 'A welcome to the players, coaches and fans.', duration: 24, src: SAMPLE_VIDEO, poster: placeholderImage(42, 800, 450), sample: true },
    { id: 3, title: 'From village pitch to county finals', text: 'How the cup runs from the first round to the final.', duration: 24, src: SAMPLE_VIDEO, poster: placeholderImage(43, 800, 450), sample: true },
    // To use a YouTube video instead of a file: { id: 4, title: '...', text: '...', youtubeId: 'VIDEO_ID', poster: '...' }
  ],

  photos: [
    { id: 1, caption: 'Kick-off at the opening match', seed: 51 },
    { id: 2, caption: 'Players line up before the game', seed: 52 },
    { id: 3, caption: 'Prize-giving on finals day', seed: 53 },
    { id: 4, caption: 'Fans on the touchline', seed: 54 },
    { id: 5, caption: 'Teams meet the patron', seed: 55 },
    { id: 6, caption: 'Trophy presentation', seed: 56 },
  ].map((p) => {
    const img = placeholderImage(p.seed)
    return { id: p.id, type: 'image', caption: p.caption, poster: img, src: img, fixture: null, sample: true }
  }),
}