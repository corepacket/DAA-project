class Dog:
    species="Canine"

    def __init__(self,name,age):

        self.name= name
        self.age=age


dog1=Dog("Buddy",3)
dog2=Dog("Charlie", 3)
print(dog1.species)
print(dog1.name)

dog1.name="Bhavika"
print(dog1.name)