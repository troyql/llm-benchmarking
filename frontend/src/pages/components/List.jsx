import ListItem from "./ListItem";
/*
Takes a json structure in the following form:
{ 
  tests: [
    {
      id: str // to be decided
      name: str
      status: str // passed, failed, anything else -> not ran 
      time: int -- the time taken to run the test. Default to -1  
    }   
 ]
}
TODO: this probably isn't the best definition
*/
function List({ data, setData }) {
  return (
    <div className="w-full overflow-y-scroll">
      {data?.tests?.map((test) => ( 
        <ListItem key={test.id} testId={test.id} setData={setData}>{test.name}</ListItem>
      ))

      }
    </div>
  )
}

export default List;