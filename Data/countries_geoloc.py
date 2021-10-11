# code collected from https://towardsdatascience.com/using-python-to-create-a-world-map-from-a-list-of-country-names-cd7480d03b10 on 9/28/2021


#---------------COUNTRY CODES-----------------
##installation
##pip install pycountry-convert

##function to convert to alpah2 country codes and continents
# from pycountry_convert import country_alpha2_to_continent_code, country_name_to_country_alpha2

# def get_continent(col):
#     try:
#         cn_a2_code =  country_name_to_country_alpha2(col)
#     except:
#         cn_a2_code = 'Unknown'
#     try:
#         cn_continent = country_alpha2_to_continent_code(cn_a2_code)
#     except:
#         cn_continent = 'Unknown' 
#     return (col, cn_a2_code, cn_continent)

# data = ['Tacana',	'Michoacan',	'Zapotec',	'Totonac',	'Tarascan',	'Herschel Island Eskimo',	'Abakan Tatar', 'Sagai',	'Buryat',	'Altaic',	'Fitzroy River area', 'Western Australia',	'Minahassa Peninsula',	'Hindu',	'Masai',	'Siberia',	'Russia',	'Romania',	'Newcastle',	'Ireland',	'Jewish Tradition',	'Book of Jasher',	'Armenia',	'Yahgan', 'Yamana',	'Selknam', 'Ono',	'Tehuelche',	'Puelche',	'Mapuche', 'Araucania',	'Toba',	'Nivaklé',	'Chorote',	'Chiriguano',	'Kaingang', 'Cayngang', 'Coroado',	'Aché', 'Axe', 'Guayaki',	'Tupi',	'Bororo',	'Karajá', 'Caraya',	'Shavante', 'Xavante',	'Kamaiurá',	'Ramkokamekra',	'Paresi', 'Paressi',	'Nambikwára', 'Nambicuara',	'Ipurina',	'Paumari', 'Abederi', 'Catauxi',	'Cashinahua', 'Kachinaua',	'Urarina',	'Tariana',	'Vaupes River',	'Yanomami',	'Maquiritari', 'Makiritare', 'Yekuana',	'Sikuani',	'Colla',	'Ancasmarca',	'Inca',	'Ancash',	'Guanca and Chiquito',	'Huarochirí Quechua',	'Chayahuita', 'Kanpopiyapi',	'Cañari',	'Shuar',	'Achuar-Shiwiar', 'Jivaro', 'Maina',	'Murato', 'Candoshi',	'Canelos Quichua',	'Quichua',	'Napo Quichua',	'Siona-Secoya', 'Angotero', 'Encabellao',	'Guambiano',	'Trio',	'Macushi', 'Macusi',	'Arekuna',	'Tamanac', 'Tamanaque', 'Tamanaku',	'Yaruro',	'Muysca', 'Chibcha',	'Arawak',	'Acawi',	'Guajiro',	'Kogi',	'Carib',	'Taino',	'Ciboney', 'Siboney',	'Panama',	'Cuna', 'Kuna',	'Nicarao',	'Kekchi',	'Quiché',	'Yucatan Maya', 'Yucatec',	'Lacandon Maya',	'Tzotzil Maya',	'Chol',	'Tzeltal',	'Pololuca',	'Trique',	'Mixtec',	'Oaxaca',	'Tlapanec',	'Tlaxcalan',	'Aztec', 'Nahuatl',	'Toltec',	'Huastec',	'Tepecano',	'Cora',	'Huichol',	'American Cowboy',	'Tepehua',	'Tarahumara',	'Yaqui',	'Papago',	'Pima',	'Yavapai', 'Mojave-Apache',	'Western Apache',	'Zuni', 'Ashiwi',	'Jicarilla Apache',	'Sia Pueblo', 'Zia',	'Navajo', 'Diné',	'Hopi',	'Havasupai',	'Quechan', 'Yuma',	'Ute',	'Washo',	'Luiseño',	'Acagchemem', 'Acjachemem',	'Wukchumni',	'Salinan',	'Costanoan', 'Ohlone',	'Central Sierra Miwok',	'Northern Miwok',	'Coast Miwok', 'Olamentko Miwok',	'Lake Miwok', 'Tuleyome',	'Ashochimi',	'Pomo',	'Maidu',	'Cahto', 'Kato',	'Sinkyone',	'Yana',	'Wintu',	'Chimariko',	'Shasta',	'Yurok',	'Cherokee',	'Choctaw',	'Chitimacha',	'Natchez',	'Tunica',	'Caddo',	'Wichita',	'Omaha',	'Pawnee',	'Arapaho',	'Brule Sioux', 'Dakota',	'Mandan',	'Yellowstone region',	'Cheyenne',	'Crow',	'Gros Ventres', 'Astina',	'Plains Ojibwa', 'Bungee',	'Blackfoot',	'Sarcee',	'Klamath',	'Oregon Cascades',	'Spokane', 'Nez Perce', 'Cayuse',	'Yakima',	'Kutenai',	'Sanpoil',	'Thompson',	'Lillooet',	'Coos',	'Kathlamet',	'Chehalis',	'Nisqually',	'Twana', 'Skokomish',	'Green River', 'Skopamish?',	'Cascade Mountains',	'Skagit',	'Klallam',	'Quileute', 'Quillayute',	'Makah',	'Cowichan',	'Squamish',	'Heiltsuk', 'Bella bella',	'Bella Coola',	'Haida',	'Tsimshian',	'Tlingit',	'Delaware', 'Lenape',	'Ottawa',	'Menomini',	'Ojibwa', 'Chippewa',	'Montagnais',	'Chipewyan',	'Beaver', 'Dane-zaa',	'Dogrib and Slave',	'Western Woods Cree',	'Tsetsaut',	'Kaska',	'Hare', 'Hareskin',	'Kutchin',	'Koyukon',	'Greenlander',	'Central Eskimo',	'Natsilingmiut', 'Netsilik',	'Inuvialuit',	'Tchiglit Eskimo',	'Inupiat',	'Bering Strait Eskimo',	'Maori',	'Tahiti',	'Raiatea', 'Leeward Islands', 'French Polynesia',	'Mangaia',	'Rakaanga',	'Samoa',	'Nanumanga',	'Hawaii',	'Fiji',	'Lifou',	'Vanuatu',	'Western Carolines',	'Palau Islands',	'Siwai',	'Usen Barok',	'Baluan-Pam',	'Milne Bay Province',	'Abadi', 'Kabadi', 'Gabadi',	'Buang',	'Morobe Province',	'Simbu Province',	'Enga',	'Foe',	'Kewa',	'Madang Province',	'Takia',	'Tangu',	'Mount Hagen',	'Boiken',	'Iatmul',	'Ilahita Arapesh',	'Abelam',	'Valman',	'Autu',	'Sawos',	'Mamberamo River',	'Waropen',	'Tasmania',	'Gunai', 'Kurnai',	'Victoria',	'Jervis Bay region',	'Eastern Australia',	'Spencer Gulf',	'Berrwerina',	'Mount Elliott', 'coastal Queensland',	'Narrinyeri', 'Ngarrindjeri',	'Wirangu',	'Kitabal', 'Githavul', 'Dijabal',	'Daisy Bates people',	'Antakarinji', 'Andingari',	'Northern Aranda',	'Cape Chatham',	'Western Australia',	'Yindjibarndi', 'Jindjiparndi',	'Ngarinyin', 'Wunambal', 'Worora',	'Yangman', 'Jangman', 'Yungmun',	'Western Arnhem Land',	'Mangeri',	'Murngin', 'Yolngu',	'Gunwinggu',	'Gumaidj',	'Maung', 'Goulburn Island',	'Ngolokwongga', 'Ngulugwongga', 'Mullukmulluk',	'Tiwi',	'Tiruray',	'Mandaya',	'Atá',	'Palawan',	'Negros',	'Igorot',	'Kiangan Ifugao',	'Ifugao',	'Tinguian',	'Apayao', 'Isneg',	'Alfoor',	'Rotti', 'Rote Island',	'Nage',	'Toraja',	'Ot-Danom',	'Tringgus Dayak',	'Dusun',	'Iban', 'Sea Dayak',	'Enggano',	'Batak',	'Nias',	'Benua-Jakun',	'Kelantan',	'Andaman Islands',	'Ami',	'Bunun',	'Saaroa',	'Tsou', 'Tsuwo',	'Atayal',	'Thai',	'Shan', 'Ahom',	'Sui',	'Zhuang',	'Sedang',	'Khmu', 'Kammu',	'Bahnar',	'Vietnam',	'Korea',	'Karen',	'Jino',	'Yi', 'Lolo',	'Lisu',	'Singpho', 'Chingpaw',	'Yao',	'Miao', 'Hmong',	'Han',	'Lanjia Saora',	'Kond',	'Munda',	'Santal',	'Ho',	'Lushai',	'Singpho',	'Anal',	'Lepcha',	'Tibet',	'Tamil',	'Kamar',	'Bhil',	'Kashmir Hindu',	'Kamchadale',	'Mongolia',	'Tuva', 'Soyot',	'Samoyed',	'Yenisey-Ostyak',	'Mansi', 'Vogul',	'Sakalava',	'Kwaya',	'Komililo Nandi',	'Kikuyu',	'Lunda',	'Southwest Tanzania',	'Songye', 'Basonge',	'Bena Lulua',	'Kongo',	'Lower Congo',	'Efe', 'Pygmy',	'Ababua',	'Ekoi',	'Efik',	'Yoruba',	'Mandingo and Mossi',	'Kaka',	'Egypt',	'Persian',	'Zoroastrian',	'Islam',	'Hebrew',	'Chaldean',	'Assyrian',	'Babylonian',	'Sumerian',	'Turkey',	'Phrygia',	'Greece',	'Rome',	'Transylvanian Gypsy',	'German',	'Lithuania',	'Celt',	'Wales',	'Sami', 'Lapp',	'Norse', 'Noachian Variations', 'Far South', 'Gran Chaco', 'Eastern Brazil', 'Amazon Basin', 'Andes', 'Northern South America', 'Caribbean', 'Mesoamerica', 'Southwest', 'Great Basin', 'California', 'Southeast', 'Plains', 'Plateau', 'Northwest Coast', 'Northeast', 'Subarctic', 'Arctic', 'Pacific', 'New Guinea', 'Australia', 'Malaysia', 'Indonesia', 'Philippines', 'East Asia', 'Central Asia', 'Northern Asia', 'Africa', 'Middle East', 'Europe']

# for item in data:
#     print(get_continent(item))

##print(get_continent("Gabadi"))

#---------------GEOLOCATE-----------------

#installation
#pip install geopy

#function to get longitude and latitude data from country name 
from geopy.geocoders import Nominatim

geopy.geocoders.options.default_user_agent = "my-application"
geolocator = Nominatim()
def geolocate(country):
    try:
        # Geolocate the center of the country
        loc = geolocator.geocode(country)
        # And return latitude and longitude
        return (loc.latitude, loc.longitude)
    except:
        # Return missing value
        return np.nan

print(geolocate('("US","NA")'))