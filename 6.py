class Person:
    def __init__(self,name,age):
        self.name=name
        self.age=age
class student(Person):
    def __init__ (self,name,age, student_id):
        super().__init__(name,age)
        self.student_id=student_id
    
    def print_detail(self):
        print("Student detaail")
        print(f"name", {self.name})
        print(f"age",{ self.age})
        print(f"studrnt_id",{self.student_id})

class cleark(Person):
    def __init__ (self,name,age, clerk_id):
        super().__init__(name,age)
        self.clerk_id=clerk_id
    
    def print_detail(self):
        print("Student detaail")
        print(f"name", {self.name})
        print(f"age",{ self.age})
        print(f"studrnt_id",{self.clerk_id})

student1=student("b",20,"1221")
student1.print_detail()

clerk=cleark("BHVA",32,"Account")
clerk1.print