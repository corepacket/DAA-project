set1=set()
elements_to=[90,67,'Bhavika','3.2','python']

def add(set1,element):
    for i in element:
        set1.add(i)
    return set1
print(set1)

print("add",add(set1,elements_to))
print(set1)
set=set(map(int,input("Enter elements of set").split()))

def str(set):
    for i in set:
        set.upper()