class Person:
    def init(self,name):
        self.name=name
class Empolyee(Person):
    def show_role(self):
        print(self.name, "empolyee")
emp=Empolyee("Sarah")
print("em", emp.name)
emp.sho/