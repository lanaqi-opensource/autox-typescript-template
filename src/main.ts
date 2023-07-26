function MyAnnotation(target: any) {
    target.prototype.name = '哈哈哈';
}

@MyAnnotation
class Person {

    public age: number;

    public name!: string;

    public constructor() {
        this.age = 18;
    }

    public toObject(): object {
        return {
            name: this.name,
            age: this.age,
        };
    }

}

const p = new Person();

console.log('Person:', p.toObject());
