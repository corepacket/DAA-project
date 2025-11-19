#include<iostream>
using namespace std;

class vehicle{
    public:
    vehicle(){
        cout<<"vehicle"<<endl;
    }
};

class car: public Vehicle{
    public:
    car(){
        cout<<"vehicle car"<<endl;
    }
};
int main(){
    car obj;
    return 0;
}