export default {
	article: {_id: {$gt: 0}, dr: false, de: false},
	draft: {_id: {$gt: 0}, dr: true, de: false},
	recycle: {_id: {$gt: 0}, de: true},
	tag: {_id: {$gte: -100000, $lte: -1001}},
	user: {_id: {$gte: -1000, $lte: -1}}
}