const CharacterTemplate = ({ data }: { data: any }) => (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold">{data.title}</h1>
      <p className="mt-4">{data.description}</p>
      {data.planet && (
        <p>
          Habite sur : <a href={`/planets/${data.planet}`}>{data.planet}</a>
        </p>
      )}
    </div>
  );
  
export default CharacterTemplate;