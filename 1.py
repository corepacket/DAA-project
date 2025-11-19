import pandas as pd
lst=['geesk','for','geeks']


data = pd.read_csv("C:/Users/Bhavika Wankhede/Desktop/New folder (7)/people_data.csv")
print(data)

df=pd.read_csv("C:/Users/Bhavika Wankhede/Desktop/New folder (7)/people_data.csv", usecols=["First Name", "Email"])
df=pd.read_csv("C:/Users/Bhavika Wankhede/Desktop/New folder (7)/people_data.csv",na_values=["N/A","Unknown"])
data = """totalbill_tip, sex:smoker, day_time, size
16.99, 1.01:Female|No, Sun, Dinner, 2
10.34, 1.66, Male, No|Sun:Dinner, 3
21.01:3.5_Male, No:Sun, Dinner, 3
23.68, 3.31, Male|No, Sun_Dinner, 2
24.59:3.61, Female_No, Sun, Dinner, 4
25.29, 4.71|Male, No:Sun, Dinner, 4"""

with open ("sample.csv","w") as file:
    file.write(data)
print(data)
df1=pd.read_csv('sample.csv',sep='[:, |_]',engine='python' )

print(df1)

df2=pd.read_csv("C:/Users/Bhavika Wankhede/Desktop/New folder (7)/people_data.csv",skiprows=[4,5])

print(df2)