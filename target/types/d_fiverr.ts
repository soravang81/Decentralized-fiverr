export type DFiverr = {
  "version": "0.1.0",
  "name": "d_fiverr",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "client",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "client",
          "type": "publicKey"
        },
        {
          "name": "freelancer",
          "type": "publicKey"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "markCompleted",
      "accounts": [
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "signer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "freelancer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "party",
          "type": "string"
        }
      ]
    },
    {
      "name": "resolveDispute",
      "accounts": [
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "recipient",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "recipient",
          "type": "publicKey"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "escrow",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "client",
            "type": "publicKey"
          },
          {
            "name": "freelancer",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "isCompleted",
            "type": "bool"
          },
          {
            "name": "clientAgreed",
            "type": "bool"
          },
          {
            "name": "freelancerAgreed",
            "type": "bool"
          },
          {
            "name": "owner",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidParty",
      "msg": "Invalid party specified"
    },
    {
      "code": 6001,
      "name": "Unauthorized",
      "msg": "Unauthorized action"
    },
    {
      "code": 6002,
      "name": "InvalidRecipient",
      "msg": "Invalid recipient"
    },
    {
      "code": 6003,
      "name": "EscrowNotCompleted",
      "msg": "Escrow not completed"
    }
  ]
};

export const IDL: DFiverr = {
  "version": "0.1.0",
  "name": "d_fiverr",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "client",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "client",
          "type": "publicKey"
        },
        {
          "name": "freelancer",
          "type": "publicKey"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "markCompleted",
      "accounts": [
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "signer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "freelancer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "party",
          "type": "string"
        }
      ]
    },
    {
      "name": "resolveDispute",
      "accounts": [
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "recipient",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "recipient",
          "type": "publicKey"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "escrow",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "client",
            "type": "publicKey"
          },
          {
            "name": "freelancer",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "isCompleted",
            "type": "bool"
          },
          {
            "name": "clientAgreed",
            "type": "bool"
          },
          {
            "name": "freelancerAgreed",
            "type": "bool"
          },
          {
            "name": "owner",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidParty",
      "msg": "Invalid party specified"
    },
    {
      "code": 6001,
      "name": "Unauthorized",
      "msg": "Unauthorized action"
    },
    {
      "code": 6002,
      "name": "InvalidRecipient",
      "msg": "Invalid recipient"
    },
    {
      "code": 6003,
      "name": "EscrowNotCompleted",
      "msg": "Escrow not completed"
    }
  ]
};