# # my_Set=set(map(char,input("Enter elements of set ").split()))

# n=int(input("Enter number of items :"))
# d={}
# for i in range(n):
#     key,value=input("Enter key and value").split()
#     d[key]=value

# unique_values=list(set(d.values()))

# print(d)
# print(unique_values)

dic1={'a':10, 'b':20, 'c':10}

dic2={'b':20, 'c':10}

def merging(dic1, dic2):
    merged=dic1.copy()
    merged.update(dic2)

    return merged
def revers_dict(d):
    return {value:key for key, value in d.items()
        
def count_string():
  lst=input("Enter strings").split()
  for itrm in lst:
    freq[item]=freq.get(item,0)+1