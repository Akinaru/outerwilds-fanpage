export const eoteDialogue = {
    start: {
        text: 'eote.start.text',
        responses: [
            { text: 'eote.start.q_continue', nextId: 'begin_story' },
            { text: 'eote.start.q_leave', nextId: 'leave' }
        ]
    },
    leave: {
        text: 'eote.leave.text',
        responses: []
    },
    begin_story: {
        text: 'eote.begin_story.text',
        responses: [
            { text: 'eote.begin_story.q_ring', nextId: 'ring' },
            { text: 'eote.begin_story.q_nothing', nextId: 'explain' }
        ]
    },
    explain: {
        text: 'eote.explain.text',
        responses: [
            { text: 'eote.explain.q_see_now', nextId: 'ring' }
        ]
    },
    ring: {
        text: 'eote.ring.text',
        responses: [
            { text: 'eote.ring.q_nomai', nextId: 'not_nomai' },
            { text: 'eote.ring.q_other_species', nextId: 'mysterious_species' }
        ]
    },
    not_nomai: {
        text: 'eote.not_nomai.text',
        responses: [
            { text: 'eote.not_nomai.q_suggest', nextId: 'mysterious_species' }
        ]
    },
    mysterious_species: {
        text: 'eote.mysterious_species.text',
        responses: [
            { text: 'eote.mysterious_species.q_explore', nextId: 'explore' },
            { text: 'eote.mysterious_species.q_hide_it', nextId: 'warning' }
        ]
    },
    warning: {
        text: 'eote.warning.text',
        responses: [
            { text: 'eote.warning.q_accept_risk', nextId: 'explore' }
        ]
    },
    explore: {
        text: 'eote.explore.text',
        responses: [
            { text: 'eote.explore.q_go', nextId: 'end' }
        ]
    },
    end: {
        text: 'eote.end.text',
        responses: []
    }
};

export default eoteDialogue;