<Query Kind="Program" />

void Main()
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
		random.NextDouble().ToString(),
		random.NextDouble().ToString(),
		random.NextDouble().ToString()};

		rows.Add(row);
		
		timeStamp = timeStamp.AddDays(1).AddSeconds(random.Next(0, 6000));

	}
	
	return rows;
}
