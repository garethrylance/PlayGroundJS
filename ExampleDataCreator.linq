<Query Kind="Program">
  <NuGetReference>Newtonsoft.Json</NuGetReference>
  <Namespace>Newtonsoft.Json</Namespace>
</Query>

void Main()
{
	var random = new Random();
	double intervalInMinutes = 1;
	var data = GetTimeSeries(DateTime.Now.AddHours(-24).ToUniversalTime(),TimeSpan.FromHours(24),intervalInMinutes)
	.Select(x => new {timeStampStart=x.AddMinutes(-intervalInMinutes/2.0),timeStampStop=x.AddMinutes(intervalInMinutes/2.0),value1=GetEvent(random),value2=GetEvent(random)});
	
	JsonConvert.SerializeObject(data,new JsonSerializerSettings() {
        DateFormatHandling = DateFormatHandling.IsoDateFormat
    }).Dump();
}






public static  List<DateTime> GetTimeSeries(DateTime start, TimeSpan length, double intervalInMinutes)
{
	var timeStamp = start;
	var end = start.Add(length);
	
	var timeList = new List<DateTime>();
	
	while(timeStamp<end){
		timeList.Add(timeStamp);
		timeStamp = timeStamp.AddMinutes(intervalInMinutes);
	}
	
	return timeList;
}

public static  String GetEvent(Random random)
{
	if(random.Next(0,10) > 8)
	{
		return "Red";
	}
	return "Green";

}


public static  void CreateCSV()
{
	using(var writer = File.CreateText(@"f:\dev\src\temp.csv"))
		{
			var headers = new List<String>{"TimeStamp","Series1","Series2","Series3"};
			writer.WriteLine(String.Join(",",headers));
			
			var rows = GetRows();
			
			foreach(var row in rows)
			{
				writer.WriteLine(String.Join(",",row));
			}
		
		}

}

// Define other methods and classes here
public static  List<List<String>> GetRows()
{
	var timeStamp = DateTime.Now;
	var end = DateTime.Now.AddDays(100);
	var random = new Random();
	var rows = new List<List<String>>();
	
	
	while(timeStamp<end){
		var row= new List<String>{
		timeStamp.ToString(),
		GetEvent(random),
		random.NextDouble().ToString(),
		random.NextDouble().ToString()};

		rows.Add(row);
		
		timeStamp = timeStamp.AddDays(1).AddSeconds(random.Next(0, 6000));

	}
	
	return rows;
}

