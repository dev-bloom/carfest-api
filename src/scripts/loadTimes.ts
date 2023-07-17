const axios = require('axios');
const cheerio = require('cheerio');

type EightMileCategory = {
  number: number;
  label: string;
};

type EightMileInfo = {
  date: Date;
  entry: number;
  reaction: number;
  sixtyFeet: number;
  kmh: number;
  time: number;
  category: EightMileCategory;
  position: number;
  categoryPosition: number;
  ignore?: number;
};

const columns: string[] = [
  'position',
  'date',
  'entry',
  'reaction',
  'sixtyFeet',
  'ignore',
  'kmh',
  'time',
];

// Get the list of participant IDs
async function getParticipants() {
  const response = await axios.get(
    'http://www.autconi.com/piques/getproducts.php?action=showAll',
  );
  const $ = cheerio.load(response.data);
  const rows = $('table tr');

  const data: EightMileInfo[] = [];

  rows.each((i: number, row: unknown) => {
    // skip the header row
    if (i === 0) return;

    const cells = $(row).find('td');
    const rowData: EightMileInfo = {} as EightMileInfo;

    cells.each((j: number, cell: unknown) => {
      // use the table header text as the property name
      const columnName: keyof EightMileInfo = $('table th').eq(j).text().trim();
      const cellValue = $(cell).text().trim();
      console.debug([columnName, cellValue]);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      rowData[columns[j]] = cellValue;
    });

    data.push(rowData);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parsedData = data.map((row: any) => {
    const parsedRow: EightMileInfo = {} as EightMileInfo;
    Object.keys(row).forEach((key: string) => {
      if (['position', 'entry', 'ignore'].includes(key)) {
        parsedRow[
          key as keyof Pick<EightMileInfo, 'entry' | 'position' | 'ignore'>
        ] = parseInt(row[key] as string, 10);
      } else if (key === 'date') {
        parsedRow[key] = new Date(row[key]);
      } else {
        parsedRow[
          key as keyof Pick<
            EightMileInfo,
            'reaction' | 'sixtyFeet' | 'kmh' | 'time'
          >
        ] = parseFloat(row[key]);
      }
    });
    const category = Math.floor(row.time);
    return {
      ...parsedRow,
      category: {
        number: category,
        label: `${category}s`,
      },
    };
  });

  return parsedData;
}

// // Get data for a specific participant
// async function getParticipantData(id: string) {
//   const response = await axios.get(
//     `http://www.autconi.com/piques/getproducts.php?action=${id}`,
//   );
//   const $ = cheerio.load(response.data);

//   const participantData = {};

//   // Use the appropriate selectors to extract the participant's data
//   // This depends on the structure of your HTML

//   return participantData;
// }

// Load all data
export const loadTimes = async () => {
  const data = await getParticipants();
  const categories = data.reduce(
    (acc: Record<string, EightMileInfo[]>, {ignore, ...row}: EightMileInfo) => {
      if (!acc[row.category.label]) {
        acc[row.category.label] = [row];
      } else {
        acc[row.category.label].push(row);
      }
      return acc;
    },
    {},
  );
  const sortedCategories = Object.keys(categories).reduce(
    (acc: Record<string, EightMileInfo[]>, key: string) => {
      acc[key] = categories[key].sort(
        (a: EightMileInfo, b: EightMileInfo) => a.time - b.time,
      );
      return acc;
    },
    {},
  );
  const categoriesWithPositions = Object.keys(sortedCategories).reduce(
    (acc: Record<string, EightMileInfo[]>, key: string) => {
      acc[key] = sortedCategories[key].map((row: EightMileInfo, i: number) => ({
        ...row,
        categoryPosition: i + 1,
      }));
      return acc;
    },
    {},
  );
  console.debug(
    'categoriesWithPositions',
    categoriesWithPositions,
    'categoriesWithPositions',
  );
  return categoriesWithPositions;
};
