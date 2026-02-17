import ContentCard from "../../Elements/Card/ContentCard";

const Content = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        <ContentCard
          image="https://images.unsplash.com/photo-1568605114967-8130f3a36994"
          title="Cozy 5 Stars Apartment"
          description="The place is close to Barceloneta Beach and bus stop just 2 min by walk.The place is close to Barceloneta Beach and bus stop just 2 min by walk and near to Naviglio where you can enjoy the main night life in Barcelona."
          location="Barcelona, Spain"
          price="899"
        />

        <ContentCard
          image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
          title="Office Studio"
          description="The place is close to Barceloneta Beach and bus stop just 2 min by walk and near to Naviglio where you can enjoy the main night life in Barcelona."
          location="London, UK"
          price="1119"
        />

        <ContentCard
          image="https://images.unsplash.com/photo-1599423300746-b62533397364"
          title="Beautiful Castle"
          description="Luxury place near main city attractions."
          location="Milan, Italy"
          price="459"
        />
      </div>
    </>
  );
};
export default Content;
