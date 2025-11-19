

list1= list(map(int,input("Enter elements of list").split()))

def tosquare(start,end):
    

    sqaure=[]
    for num in range(start,end+1):
        sqaure.append(num*num)

    return sqaure

def largest(list1):
    largest=list[0]
    for num in list1:
        if num>largest:
            largest=num
    return largest
print("list",list1)

print("Largest",largest(list1))
# print("Remvrd even", tosquare(start,end ))