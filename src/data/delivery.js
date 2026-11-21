// To change a price, edit its zone fee here and push. To add an area, add one name to the zone list.
const deliveryZones = [
  {
    zone: 'Island A',
    fee: 5000,
    names: [
      'Osborne', 'Ikoyi', 'Parkview Estate', 'Banana Island', 'Gerrard Road', 'Bourdillon Road',
      'Alfred Rewane Road', 'Ikoyi Club', 'Awolowo Road', 'Falomo', 'Kingsway Road', 'Oniru',
      'Victoria Island (VI)',
    ],
  },
  {
    zone: 'Island B',
    fee: 5500,
    names: [
      'Admiralty Way', 'Freedom Way', 'Fola Osibo', 'Hakeem Dickson', 'Marwa', 'Providence Street',
      'Wole Olateju', 'Omorinre Johnson Street', 'Lekki-Ikoyi Link Bridge Axis', 'Adebayo Doherty Road',
      'T.F. Kuboye Road', 'Bisola Durosinmi-Etti Drive',
    ],
  },
  {
    zone: 'Island C',
    fee: 6000,
    names: [
      'Osapa London', 'Agungi', 'Ikate', 'Igbo-Efon', 'Jakande', 'Chevron Drive', 'Chevron', 'VGC',
      'Ikota', 'Megamound Estate', 'Orchid Road', 'Ikota Shopping Complex Axis', 'Abraham Adesanya',
      'Addo Road', 'Badore', 'Oke Ira Nla', 'Lekki Palm City', 'Lekki County Homes', 'Eleganza',
      'Lekki Scheme 2',
    ],
  },
  {
    zone: 'Island D',
    fee: 7000,
    names: ['Lagos Business School (LBS)', 'Olokonla', 'Sangotedo'],
  },
  {
    zone: 'Mainland A',
    fee: 3000,
    names: [
      'Ikotun Roundabout', 'Ikotun Market', 'Egbe', 'SCOAN / Synagogue', 'Igando Road Junction',
      'Igando', 'Igando Police Station', 'LASU-Isheri Road', 'Egan', 'Olorunfemi', "Governor's Road",
      'College Bus Stop', 'Odo-Eran', 'Council Bus Stop', 'Idimu', 'Pipeline', 'Egbeda Bus Stop',
      'Egbeda Roundabout', 'Akowonjo', 'Cele Bus Stop', 'Hostel Bus Stop Ikotun', 'Iyana-Ejigbo',
      'Ejigbo', 'Ejigbo Last Bus Stop', 'NNPC Ejigbo', 'Diamond Estate', 'Isheri Olofin',
    ],
  },
  {
    zone: 'Mainland B',
    fee: 3500,
    names: [
      'Afolabi Bus Stop Akesan', 'Vulcanizer Bus Stop Akesan', 'Ile Epo Bus Stop Akesan',
      'Ewedogbon Bus Stop Akesan', 'Adexon Bus Stop Akesan', 'Araromi Bus Stop Akesan',
      'Akesan Community', 'Shasha', 'Orisumbare', 'Ijegun', 'Abaranje', 'Isolo', 'Baruwa',
      'Isheri Oshun', 'Jakande Gate', 'Ikeja', 'Oshodi', 'Ajao Estate', 'Iyanapaja',
      'Ipaja Roundabout', 'Command', 'Abesan Estate', 'Ipaja Market', 'Gowon Estate',
    ],
  },
  {
    zone: 'Mainland C',
    fee: 4000,
    names: [
      'Igboelerin', 'Iba Ojo', 'Alausa Ikeja', 'Iba Housing Estate', 'Ipaye', 'Iyana School',
      'Church Pole', 'Adolf', 'Agboroko', 'Abule Egba', 'Agege', 'LASU', 'Post Service LASU',
      'Mushin', 'Surulere', 'Ogba', 'Ilupeju', 'Ago', 'Okota', 'Meiran', 'Onipan', 'Ayobo',
      'Ikola Ipaja',
    ],
  },
  {
    zone: 'Mainland D',
    fee: 4500,
    names: [
      'Fadeyi', 'Shomolu', 'Bariga', 'Gbagada', 'Yaba', 'Palmgroove', 'Bajulaiye', 'Pedro',
      'Obanikoro', 'Jibowu', 'Herbert Macaulay', 'Unilag', 'Fola Agoro', 'Akoka', 'Oke Ira Ogba',
      'Ifako Gbagada', 'Abule Ijesha',
    ],
  },
  {
    zone: 'Mainland E',
    fee: 5000,
    names: [
      'Ebute Metta', 'Oyingbo', 'Railway Compound', 'Maryland', 'Makoko', 'Magodo', 'Ketu Alapere',
      'Ojota', 'Ogudu', 'Mile 12', 'Oworoshoki', 'Okoko', 'Apapa', 'Alakuko', 'Alagbado',
      'Iyana Isashi', 'Orile', 'Festac', 'Satellite Town', 'Ojo Barracks', 'Ifako Ijaiye',
      'Ijaiye Ojokoro', 'Iju Ishaga', 'Ojodu Berger (Lagos Axis)', 'Kayfarm', 'Olowora',
      'Oke Ira Ebute Metta', 'National Theatre', 'Ajegunle',
    ],
  },
];

const slugify = (value) => value
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

export const deliveryAreas = deliveryZones.flatMap(({ zone, fee, names }) => names.map((name) => ({
  id: slugify(`${zone} ${name}`),
  name: name.trim(),
  fee,
  zone,
})));

export const sortedDeliveryAreas = [...deliveryAreas].sort((first, second) => first.name.localeCompare(second.name));