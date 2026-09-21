export interface BoardMember {
  name: string;
  position: string;
  pronouns?: string;
  year?: string;
  imageUrl: string;
  major: string;
  instrument: string;
  minor?: string;
}

export const boardMembers: BoardMember[] = [
  {
    name: "Zing Li",
    position: "President",
    pronouns: "he/him",
    year: "3rd year",
    instrument: "Oboe",
    imageUrl: "/board/zing.webp",
    major: "Political Science and Economics",
    minor: "Music and Chinese Studies",
  },

  {
    name: "Evan Gabriel",
    position: "Vice President Internal",
    pronouns: "He/Him",
    year: "3rd year",
    instrument: "French Horn/Trumpet",
    imageUrl: "/board/evan.webp",
    major: "Pharmacological Chemistry",
  },

  {
    name: "Daphne Ko",
    position: "VP External",
    pronouns: "she/her",
    year: "2nd year",
    instrument: "Piano, Violin, Alto Saxophone",
    imageUrl: "/board/daphne.webp",
    major: "Molecular and Cell Biology",
  },

  {
    name: "Linda Yun",
    position: "Treasurer",
    pronouns: "She/her",
    year: "2nd year",
    instrument: "Piano",
    imageUrl: "/board/linda.webp",
    major: "Political Science",
  },

  {
    name: "Kayla Rodriguez",
    position: "Secretary",
    pronouns: "She/her",
    year: "4th year",
    instrument: "Flute",
    imageUrl: "/board/kayla.webp",
    major: "Mathematics",
    minor: "Engineering Mechanics",
  },

  {
    name: "Kaden Cho",
    position: "Artistic Director",
    pronouns: "He/Him",
    year: "4th year",
    instrument: "Piano, Clarinet",
    imageUrl: "/board/kaden.webp",
    major: "Business Psychology & Music",
  },

  {
    name: "John Barreto",
    position: "Fundraising Chair",
    pronouns: "he/him",
    year: "2nd year",
    instrument: "Violin, Voice",
    imageUrl: "/board/john.webp",
    major: "Applied Mathematics",
    minor: "Data Science",
  },

  {
    name: "Elnaz Champiri",
    position: "Publicity",
    pronouns: "she/her",
    year: "3rd year",
    instrument: "Violin",
    imageUrl: "/board/elnaz.webp",
    major: "Molecular and Cell Biology",
  },

  {
    name: "Sylvia Zhang",
    position: "Social Chair",
    pronouns: "she/her",
    year: "2nd year",
    instrument: "Cello, Piano",
    imageUrl: "/board/sylvia.webp",
    major: "Neurobiology",
    minor: "Sociology",
  },

  {
    name: "Daniel Xu",
    position: "Webmaster",
    pronouns: "he/him",
    year: "2nd year",
    instrument: "Violin",
    imageUrl: "/board/daniel.webp",
    major: "Data Science",
  },
];
