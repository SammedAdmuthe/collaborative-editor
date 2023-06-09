# -*- coding: utf-8 -*-
"""testScript.ipynb

Automatically generated by Colaboratory.

Original file is located at
    https://colab.research.google.com/drive/1waQBVlVeT_BgMZNTy8tTwmFRQgS6oQFT
"""

import json

# Calculate Message Length

typeList1 = []
originServer1 = []
timestamp1 = []
mssgLenList = []
insertCountList = []
deleteCountList = []

with open('output3000.txt', 'r') as f:

    for line in f:

        substrings = line.strip().split("||")
        typeList1.append(substrings[0])

        originServer1.append(substrings[1])
        timestamp1.append(int(substrings[2].split(": ")[1]))
        json_obj = json.loads(substrings[0])
     
        if len(json_obj) > 1:
          count = 0
          insertCount = 0
          deleteCount = 0 
          for mssg in json_obj:
            if(mssg["type"] == "insert"):
              count = count + len(mssg["values"])
              insertCount = insertCount + 1
            else: 
              count = count + mssg["howMany"]
              deleteCount = deleteCount + 1

          mssgLenList.append(count)
          insertCountList.append(insertCount)
          deleteCountList.append(deleteCount)

        elif len(json_obj) == 1:
           if json_obj[0]['type'] == "insert":
              mssgLenList.append(len(json_obj[0]['values']))
              insertCountList.append(1)
              deleteCountList.append(0)
           else:
              mssgLenList.append(json_obj[0]['howMany'])
              insertCountList.append(0)
              deleteCountList.append(1)
        else: 
          mssgLenList.append(-1)
          insertCountList.append(-1)
          deleteCountList.append(-1)

typeList2 = []
originServer2 = []
timestamp2 = []

with open('output3001.txt', 'r') as f:
    # Iterate over the lines in the file
    for line in f:
        # Print each line
        substrings = line.strip().split("||")
        originServer2.append(substrings[1])
        typeList2.append(substrings[0])
        timestamp2.append(int(substrings[2].split(": ")[1]))

typeList3 = []
originServer3 = []
timestamp3 = []

with open('output3008.txt', 'r') as f:
    # Iterate over the lines in the file
    for line in f:
        # Print each line
        substrings = line.strip().split("||")
        originServer3.append(substrings[1])
        timestamp3.append(int(substrings[2].split(": ")[1]))
        typeList3.append(substrings[0])

originServer = []

for os1, os2, os3 in zip(originServer1, originServer2, originServer3):
  if "Origin Server : -1" in os1 and "Origin Server : -1" in os2:
    originServer.append(3)
  elif "Origin Server : -1" in os2 and "Origin Server : -1" in os3:
    originServer.append(1) 
  elif "Origin Server : -1" in os1 and "Origin Server : -1" in os3:
    originServer.append(2)

from tabulate import tabulate

data1 = []
headers = ["# Insert Operation", "# Delete Operation", "Timestamp1", "Timestamp2", "Timestamp3", "Origin Server"]

for iCount, dCount, ts1, ts2, ts3, os in zip(insertCountList, deleteCountList, timestamp1, timestamp2, timestamp3, originServer):
  row = []
  row.append(iCount)
  row.append(dCount)
  row.append(ts1)
  row.append(ts2)
  row.append(ts3)
  row.append(os)

  data1.append(row)

print(tabulate(data1, headers=headers))

data2 = []
headers = ["# Insert Operation", "# Delete Operation", "Latency for Server 1", "Latency for Server 2", "Latency for Server 3"]

for iCount, dCount, ts1, ts2, ts3, os in zip(insertCountList, deleteCountList, timestamp1, timestamp2, timestamp3, originServer):
  row = []
  row.append(iCount)
  row.append(dCount)
  if os == 1:
    row.append(0)
    row.append(ts2-ts1)
    row.append(ts3-ts1)
  if os == 2:
    row.append(ts1-ts2)
    row.append(0)
    row.append(ts3-ts2) 
  if os == 3:
    row.append(ts1-ts3)
    row.append(ts2-ts3)
    row.append(0)   

  data2.append(row)

print(tabulate(data2, headers=headers))

#print("The average latency on Server 1 is:"+str(sum(data[2])/len(data[2])))
#print("The average latency on Server 2 is:"+str(sum(data[3])/len(data[3])))
#print("The average latency on Server 3 is:"+str(sum(data[4])/len(data[4])))

sumOfLatency1 = 0
sumOfLatency2 = 0
sumOfLatency3 = 0
rowCount = 0

# Loop through the rows of the array
for row in data2:
    # Add the element in the third column of the current row to the sum
    sumOfLatency1 += row[2]
    sumOfLatency2 += row[3]
    sumOfLatency3 += row[4]
    rowCount += 1

print("Average Latency of Server 1: "+str(round(sumOfLatency1/rowCount, 3))+"ms")
print("Average Latency of Server 2: "+str(round(sumOfLatency2/rowCount, 3))+"ms")
print("Average Latency of Server 3: "+str(round(sumOfLatency3/rowCount, 3))+"ms")

consistencyCount = []

for tl1, tl2, tl3 in zip(typeList1, typeList2, typeList3):
  jsonObj1 = json.loads(tl1)
  jsonObj2 = json.loads(tl2)
  jsonObj3 = json.loads(tl3)

  difference = 0

  if len(jsonObj1) > 1:
    for msg1, msg2, msg3 in zip(jsonObj1, jsonObj2, jsonObj3):
        if(msg1["type"] == "insert"):
          if msg1["values"] == msg2["values"] == msg3["values"]:
            difference = 0
          else: 
            difference += 1 

        if(msg1["type"] == "delete"):
          if msg1["howMany"] == msg2["howMany"] == msg3["howMany"]:
            difference = 0
          else: 
            difference += 1

    consistencyCount.append(difference) 
      
  elif len(jsonObj1) == 1:
      if(jsonObj1[0]["type"] == "insert"):
          if jsonObj1[0]["values"] == jsonObj2[0]["values"] == jsonObj3[0]["values"]:
            difference = 0
          else: 
            difference += 1

      if(jsonObj1[0]["type"] == "delete"):
          if jsonObj1[0]["howMany"] == jsonObj2[0]["howMany"] == jsonObj3[0]["howMany"]:
            difference += 0
          else: 
            difference += 1 

      consistencyCount.append(difference)

  elif len(jsonObj1) == 0 and len(jsonObj2) == 0 and len(jsonObj3) == 0: 
      difference += 0
      consistencyCount.append(difference)        

print("We add all inconsistency:")

print("Sum is: "+str(sum(consistencyCount)))

if sum(consistencyCount) == 0:
  print("The data is eventually consistent, it shows that the data is consistent on all servers!")

