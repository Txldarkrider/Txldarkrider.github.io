class Item {
    constructor(Id, Name, Amount,SpawnType,Color,collectedId,collectedName,collectedSpawntype,collectedColor) {
        this.id = Id;
        this.name = Name; //Unique Identifier;
        this.amount = Amount;
		this.spawnType = SpawnType;
		if(this.spawnType == "ResourceGenerator"){
			this.collectedId = collectedId;
			this.collectedName = collectedName;
			this.collectedSpawntype = collectedSpawntype;
			this.collectedColor = collectedColor;
		}
		this.color = Color;
    }
}


class Recipe {
    constructor(/*Array Of Blocks*/Inp,/*Array Of Blocks*/Out) {
        this.inp = Inp;
        this.out = Out;
    }
    Craft(Inv) {
        let Trues = 0;
        for (let key in this.inp) {
            if (Inv.Items[this.inp[key].item.name].item !== undefined) {
                if (Inv.Items[this.inp[key].item.name].item.amount >= this.inp[key].item.amount) {
                    Trues += 1;
                } else {
                    return console.log("Not Enough Resources");
                }
            } else {
                return console.log("Item Doesnt Exist");
            }
        }
        if (Trues == this.inp.length) {
            console.log("Can Craft");
            for (let key in this.inp) {
                Inv.Remove(new Block(new Tile(Inv.Items[this.inp[key].item.name].tile.rect.x, Inv.Items[this.inp[key].item.name].tile.x, Inv.Items[this.inp[key].item.name].tile.rect.y, Inv.Items[this.inp[key].item.name].tile.rect.h, Inv.Items[this.inp[key].item.name].tile.rect.c), new Item(Inv.Items[this.inp[key].item.name].item.name, this.inp[key].item.amount)));
            }
            for (let key in this.out) {
                Inv.Add(new Block(new Tile(Inv.Items[this.out[key].item.name].tile.rect.x, Inv.Items[this.out[key].item.name].tile.x, Inv.Items[this.out[key].item.name].tile.rect.y, Inv.Items[this.out[key].item.name].tile.rect.h, Inv.Items[this.out[key].item.name].tile.rect.c), new Item(Inv.Items[this.out[key].item.name].item.name, this.out[key].item.amount)));
            }
        }
    }
}


class Inventory {
    constructor() {
        this.Items = [];
    }
    Add(Item) {
        if (this.Items[Item.id] !== undefined) {
            this.Items[Item.id].amount += 1;
        } else {
            this.Items[Item.id] = Item;
        }
    }
    Remove(Item) {
        if (this.Items[Item.id] !== undefined) {
            this.Items[Item.id].amount -= 1;
            if (this.Items[Item.id].amount <= 0) {
                delete this.Items[Item.id];
            }
        }
    }
}
