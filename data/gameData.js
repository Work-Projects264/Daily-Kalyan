const singlepatti = {
  "Panna ank 0": ["127", "136", "145", "190", "235", "280", "370", "479", "460", "569", "389", "578"],
  "Panna ank 1": ["128", "137", "146", "236", "245", "290", "380", "470", "489", "560", "678", "579"],
  "Panna ank 2": ["129", "138", "147", "156", "237", "246", "345", "390", "480", "570", "679", "589"],
  "Panna ank 3": ["120", "139", "148", "157", "238", "247", "256", "346", "490", "580", "670", "689"],
  "Panna ank 4": ["130", "149", "158", "167", "239", "248", "257", "347", "356", "590", "680", "789"],
  "Panna ank 5": ["140", "159", "168", "230", "249", "258", "267", "348", "357", "456", "690", "780"],
  "Panna ank 6": ["123", "150", "169", "178", "240", "259", "268", "349", "358", "457", "367", "790"],
  "Panna ank 7": ["124", "160", "179", "250", "269", "278", "340", "359", "368", "458", "467", "890"],
  "Panna ank 8": ["125", "134", "170", "189", "260", "279", "350", "369", "378", "459", "567", "468"],
  "Panna ank 9": ["126", "135", "180", "234", "270", "289", "360", "379", "450", "469", "478", "568"],
};

const doublepatti = {
  "Panna ank 0": ["550", "668", "244", "299", "226", "488", "677", "118", "334"],
  "Panna ank 1": ["100", "119", "155", "227", "335", "344", "399", "588", "669"],
  "Panna ank 2": ["200", "110", "228", "255", "336", "499", "660", "688", "778"],
  "Panna ank 3": ["300", "166", "229", "337", "355", "445", "599", "779", "788"],
  "Panna ank 4": ["400", "112", "220", "266", "338", "446", "455", "699", "770"],
  "Panna ank 5": ["500", "113", "122", "177", "339", "366", "447", "799", "889"],
  "Panna ank 6": ["600", "114", "277", "330", "448", "466", "556", "880", "899"],
  "Panna ank 7": ["700", "115", "133", "188", "223", "377", "449", "557", "566"],
  "Panna ank 8": ["800", "116", "224", "233", "288", "440", "477", "558", "990"],
  "Panna ank 9": ["900", "117", "144", "199", "225", "388", "559", "577", "667"],
};

const tripplepatti = ["111", "222", "333", "444", "555", "666", "777", "888", "999", "000"];

const single_ank = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

let jodi_ank = [
  "00",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
  "47",
  "48",
  "49",
  "50",
  "51",
  "52",
  "53",
  "54",
  "55",
  "56",
  "57",
  "58",
  "59",
  "60",
  "61",
  "62",
  "63",
  "64",
  "65",
  "66",
  "67",
  "68",
  "69",
  "70",
  "71",
  "72",
  "73",
  "74",
  "75",
  "76",
  "77",
  "78",
  "79",
  "80",
  "81",
  "82",
  "83",
  "84",
  "85",
  "86",
  "87",
  "88",
  "89",
  "90",
  "91",
  "92",
  "93",
  "94",
  "95",
  "96",
  "97",
  "98",
  "99",
];

let sangamArray = [
  0, 100, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 122, 123, 124, 125, 126, 127, 128, 129, 130, 133, 134,
  135, 136, 137, 138, 139, 140, 144, 145, 146, 147, 148, 149, 150, 155, 156, 157, 158, 159, 160, 166, 167, 168, 169,
  170, 177, 178, 179, 180, 188, 189, 190, 199, 200, 220, 222, 223, 224, 225, 226, 227, 228, 229, 230, 233, 234, 235,
  236, 237, 238, 239, 240, 244, 245, 246, 247, 248, 249, 250, 255, 256, 257, 258, 259, 260, 266, 267, 268, 269, 270,
  277, 278, 279, 280, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300, 330, 333, 334, 335, 336, 337,
  338, 339, 340, 344, 345, 346, 347, 348, 349, 350, 355, 356, 357, 358, 359, 360, 366, 367, 368, 369, 370, 377, 378,
  379, 380, 388, 389, 390, 399, 400, 440, 444, 445, 446, 447, 448, 449, 450, 455, 456, 457, 458, 459, 460, 466, 467,
  468, 469, 470, 477, 478, 479, 480, 488, 489, 490, 499, 500, 550, 555, 556, 557, 558, 559, 560, 566, 567, 568, 569,
  570, 577, 578, 579, 580, 588, 589, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599, 600, 660, 666, 667, 668, 669,
  670, 677, 678, 679, 680, 681, 682, 683, 684, 685, 686, 687, 688, 689, 690, 699, 700, 770, 777, 778, 779, 780, 799,
  800, 880, 899, 900, 990, 999,
];

// let single_ank1 = [
//   "000",
//   "100",
//   "110",
//   "111",
//   "112",
//   "113",
//   "114",
//   "115",
//   "116",
//   "117",
//   "118",
//   "119",
//   "120",
//   "122",
//   "123",
//   "124",
//   "125",
//   "126",
//   "127",
//   "128",
//   "129",
//   "130",
//   "133",
//   "134",
//   "135",
//   "136",
//   "137",
//   "138",
//   "139",
//   "140",
//   "144",
//   "145",
//   "146",
//   "147",
//   "148",
//   "149",
//   "150",
//   "155",
//   "156",
//   "157",
//   "158",
//   "159",
//   "160",
//   "166",
//   "167",
//   "168",
//   "169",
//   "170",
//   "177",
//   "178",
//   "179",
//   "180",
//   "188",
//   "189",
//   "190",
//   "199",
//   "200",
//   "220",
//   "222",
//   "223",
//   "224",
//   "225",
//   "226",
//   "227",
//   "228",
//   "229",
//   "230",
//   "233",
//   "234",
//   "235",
//   "236",
//   "237",
//   "238",
//   "239",
//   "240",
//   "244",
//   "245",
//   "246",
//   "247",
//   "248",
//   "249",
//   "250",
//   "255",
//   "256",
//   "257",
//   "258",
//   "259",
//   "260",
//   "266",
//   "267",
//   "268",
//   "269",
//   "270",
//   "277",
//   "278",
//   "279",
//   "280",
//   "288",
//   "289",
//   "290",
//   "291",
//   "292",
//   "293",
//   "294",
//   "295",
//   "296",
//   "297",
//   "298",
//   "299",
//   "300",
//   "330",
//   "333",
//   "334",
//   "335",
//   "336",
//   "337",
//   "338",
//   "339",
//   "340",
//   "344",
//   "345",
//   "346",
//   "347",
//   "348",
//   "349",
//   "350",
//   "355",
//   "356",
//   "357",
//   "358",
//   "359",
//   "360",
//   "366",
//   "367",
//   "368",
//   "369",
//   "370",
//   "377",
//   "378",
//   "379",
//   "380",
//   "388",
//   "389",
//   "390",
//   "399",
//   "400",
//   "440",
//   "444",
//   "445",
//   "446",
//   "447",
//   "448",
//   "449",
//   "450",
//   "455",
//   "456",
//   "457",
//   "458",
//   "459",
//   "460",
//   "466",
//   "467",
//   "468",
//   "469",
//   "470",
//   "477",
//   "478",
//   "479",
//   "480",
//   "488",
//   "489",
//   "490",
//   "499",
//   "500",
//   "550",
//   "555",
//   "556",
//   "557",
//   "558",
//   "559",
//   "560",
//   "566",
//   "567",
//   "568",
//   "569",
//   "570",
//   "577",
//   "578",
//   "579",
//   "580",
//   "588",
//   "589",
//   "590",
//   "591",
//   "592",
//   "593",
//   "594",
//   "595",
//   "596",
//   "597",
//   "598",
//   "599",
//   "600",
//   "660",
//   "666",
//   "667",
//   "668",
//   "669",
//   "670",
//   "677",
//   "678",
//   "679",
//   "680",
//   "681",
//   "682",
//   "683",
//   "684",
//   "685",
//   "686",
//   "687",
//   "688",
//   "689",
//   "690",
//   "699",
//   "700",
//   "770",
//   "777",
//   "778",
//   "779",
//   "780",
//   "799",
//   "800",
//   "880",
//   "899",
//   "900",
//   "990",
//   "999",
// ];

const renderDigit = (name) => {
  let names = {
    "jodi-digit": jodi_ank,
    "single-digit": single_ank,
    "single-panna": singlepatti,
    "double-panna": doublepatti,
    "triple-panna": tripplepatti,
    "half-sangam": "input",
    "full-sangam": "input",
    "LEFT-DIGIT": single_ank,
    "RIGHT-DIGIT": single_ank,
    "JODI-DIGIT": jodi_ank,
    halfsangam: sangamArray,
  };

  return names[name];
};

export default renderDigit;
