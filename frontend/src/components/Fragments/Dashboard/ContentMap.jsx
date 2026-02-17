import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
const data = [
  {
    country: "United States",
    sales: 2500,
    value: "$230,900",
    bounce: "29.9%",
    coordinates: [40, -100],
  },
  {
    country: "Germany",
    sales: 3900,
    value: "$440,000",
    bounce: "40.22%",
    coordinates: [51, 10],
  },
  {
    country: "Great Britain",
    sales: 1400,
    value: "$190,700",
    bounce: "23.44%",
    coordinates: [55, -3],
  },
  {
    country: "Brazil",
    sales: 562,
    value: "$143,960",
    bounce: "32.14%",
    coordinates: [-10, -51],
  },
];

const ContentMap = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mt-10">
      <h2 className="text-lg font-semibold">Sales by Country</h2>
      <p className="text-gray-500 text-sm mb-6">
        Check the sales, value and bounce rate by country.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT SIDE */}
        <div className="space-y-6">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b pb-4"
            >
              <div>
                <p className="font-semibold">{item.country}</p>
                <p className="text-sm text-gray-500">Sales: {item.sales}</p>
              </div>

              <div className="text-right text-sm text-gray-500">
                <p>Value: {item.value}</p>
                <p>Bounce: {item.bounce}</p>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE MAP */}
        <div className="h-[350px] w-full rounded-xl overflow-hidden -mt-13">
          <MapContainer
            center={[20, 0]}
            zoom={2}
            scrollWheelZoom={false}
            className="h-full w-full"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {data.map((item, i) => (
              <CircleMarker
                key={i}
                center={item.coordinates}
                radius={8}
                pathOptions={{
                  color: "#fff",
                  weight: 2,
                  fillColor: "#EC4899",
                  fillOpacity: 1,
                }}
              >
                <Popup>
                  <strong>{item.country}</strong>
                  <br />
                  Sales: {item.sales}
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};
export default ContentMap;
