<Query Kind="Program">
  <NuGetReference>Newtonsoft.Json</NuGetReference>
  <Namespace>Newtonsoft.Json</Namespace>
</Query>

void Main()
{


	var fileName=@"C:\temp\sdg_uptime_day.csv";
	var rows =  GetRows(fileName);
	var data = rows.Select( x=> new {timeStamp=x[0],calls=x[1],transactions=x[2],errors=x[3],isFailed=x[4]});
	
	
	JsonConvert.SerializeObject(data,new JsonSerializerSettings() {
        DateFormatHandling = DateFormatHandling.IsoDateFormat
    }).Dump();
}



public static List<List<String>> GetRows(String fileName)
{
	var lines = new List<List<String>>();
	using(var file = File.OpenText(fileName))
	{
		var line = file.ReadLine();
		line.Dump();

		while ((line = file.ReadLine()) != null)
		{
			lines.Add(line.Split(',').ToList());
		}
	}
	
	return lines;
}


