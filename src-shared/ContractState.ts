type ContractState = {
  pets: { petId: number; isHungry: boolean; owner?: string; lastFed: Date }[];
};

export default ContractState;
