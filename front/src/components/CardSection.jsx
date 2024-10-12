import React from "react";
import Card from "./Card";
import cardData from "../data/cardData";

const CardSection = () => {
    return (
        <div>
            <div className="grid grid-cols-4 gap-3 pt-8 mb-10">
                {cardData.map((card) => {
                    return (
                        <div key={card.id}>
                            <Card id={card.id} name={card.name} img={card.image} status={card.status}></Card>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default CardSection;