import React from 'react'
import Card from '@/components/ui/Card'
import CardHeader from '@/components/ui/CardHeader'
import GetEmailAddress from '../wallet-methods/GetEmailAddress'

const TestMethods = () => {

	return (
		<Card>
			<CardHeader id='methods'>Methods for Test</CardHeader>
				<GetEmailAddress />
		</Card>
	)
}

export default TestMethods
