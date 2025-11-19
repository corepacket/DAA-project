class student:
    def __init__(self,name,marks):
        self.name=name
        self.marks=marks
        self.total=0
        self.grade=''
        self.precentage=0
    def calculate(self):
        self.total=sum(self.marks)
        self.percentage= self.total/len(self.marks)

        if self.percentage>=90:
            self.grade='A'
        elif self.percentage>=80:
            self.grade='B'
        elif self.percentage>=70:
            self.grade='C'
        elif self.percentage>=60:
            self.grade='D'
        else:
            self.grade='F'

    def display(self):
        print(f"Student name: {self.name}")
        print(f"maarksc:{self.marks}")

name=input("Enter student name")

marks=[]
print("Enter marks of 5 subject :")
for i in range(5):
    mak=int(input(f"Enter marks{i+1}"))
    marks.append(mak  )

student=student(name,marks)

student.calculate()
student.display()